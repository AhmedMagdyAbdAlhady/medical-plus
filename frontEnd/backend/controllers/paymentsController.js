/**
 * paymentsController.js
 *
 * Handles Stripe checkout, webhooks, enrollments, and payment records.
 * Flow: student pays → Stripe webhook → recordPayment() → Enrollment + Payment in DB.
 */

const Stripe = require("stripe");
const { Course } = require("../models/courses");
const { Enrollment } = require("../models/enrollments");
const { Payment } = require("../models/payments");

/* -------------------------------------------------------------------------- */
/*  Stripe client (lazy init — server starts even without STRIPE_SECRET_KEY)   */
/* -------------------------------------------------------------------------- */

let stripeClient = null;

/** Returns Stripe SDK instance or null if not configured. */
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) stripeClient = new Stripe(key);
  return stripeClient;
}

/* -------------------------------------------------------------------------- */
/*  Price helpers (USD dollars ↔ Stripe cents)                                 */
/* -------------------------------------------------------------------------- */

/** Final course price in dollars after discount, rounded to 2 decimals. */
function getCourseAmount(course) {
  const discount = course.discount || 0;
  return Math.max(0, Math.round((course.price - discount) * 100) / 100);
}

/** Stripe Checkout expects amount in cents (integer). */
function getStripePrice(course) {
  return Math.round(getCourseAmount(course) * 100);
}

/* -------------------------------------------------------------------------- */
/*  Core: save enrollment + payment (idempotent)                               */
/* -------------------------------------------------------------------------- */

/**
 * Creates or updates enrollment and stores a Payment row.
 * Skips duplicate work if same stripeSessionId or student+course already paid.
 *
 * @returns {boolean} true if enrollment/payment exists or was created
 */
async function recordPayment({
  studentId,
  courseId,
  amount,
  currency = "usd",
  status = "completed",
  stripeRef,
  stripePaymentIntentId,
}) {
  if (!studentId || !courseId || !stripeRef) return false;

  // Already processed this Stripe session — still ensure enrollment exists
  const existingPayment = await Payment.findOne({ stripeSessionId: stripeRef });
  if (existingPayment) {
    await Enrollment.findOneAndUpdate(
      { student: studentId, course: courseId },
      {
        student: studentId,
        course: courseId,
        stripeSessionId: stripeRef,
        status: "active",
        purchasedAt: existingPayment.paidAt || new Date(),
      },
      { upsert: true, new: true },
    );
    return true;
  }

  // Student already has a payment record for this course
  const existingForCourse = await Payment.findOne({
    student: studentId,
    course: courseId,
  });
  if (existingForCourse) {
    await Enrollment.findOneAndUpdate(
      { student: studentId, course: courseId },
      {
        student: studentId,
        course: courseId,
        stripeSessionId: stripeRef,
        status: "active",
        purchasedAt: existingForCourse.paidAt || new Date(),
      },
      { upsert: true, new: true },
    );
    return true;
  }

  const course = await Course.findById(courseId);
  if (!course) return false;

  const finalAmount = amount ?? getCourseAmount(course);
  const paymentStatus = status || (finalAmount === 0 ? "free" : "completed");

  // Grant course access
  await Enrollment.findOneAndUpdate(
    { student: studentId, course: courseId },
    {
      student: studentId,
      course: courseId,
      stripeSessionId: stripeRef,
      status: "active",
      purchasedAt: new Date(),
    },
    { upsert: true, new: true },
  );

  // Persist payment for student profile + admin reports
  await Payment.create({
    student: studentId,
    course: courseId,
    amount: finalAmount,
    currency,
    status: paymentStatus,
    stripeSessionId: stripeRef,
    stripePaymentIntentId: stripePaymentIntentId || undefined,
    paidAt: new Date(),
  });

  return true;
}

/** Alias used by webhook handlers. */
async function fulfillEnrollment(opts) {
  return recordPayment(opts);
}

/* -------------------------------------------------------------------------- */
/*  POST /api/payments/checkout — start Stripe Checkout (students)              */
/* -------------------------------------------------------------------------- */

exports.createCheckout = async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).send({ message: "Stripe is not configured." });
  }

  const course = await Course.findById(req.body.courseId);
  if (!course || !course.isPublished) {
    return res.status(404).send({ message: "Course not found." });
  }

  const existing = await Enrollment.findOne({
    student: req.user._id,
    course: course._id,
    status: "active",
  });
  if (existing) {
    return res.status(400).send({ message: "Already enrolled in this course." });
  }

  const unitAmount = getStripePrice(course);

  // Free course: enroll immediately, no Stripe session
  if (unitAmount <= 0) {
    const stripeRef = `free_${req.user._id}_${course._id}`;
    await recordPayment({
      studentId: req.user._id.toString(),
      courseId: course._id.toString(),
      amount: 0,
      status: "free",
      stripeRef,
    });
    return res.send({
      url: `${process.env.STRIPE_SUCCESS_URL}?courseId=${course._id}&free=true`,
      free: true,
    });
  }

  const metadata = {
    courseId: course._id.toString(),
    studentId: req.user._id.toString(),
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
            description: course.description?.substring(0, 200),
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    metadata,
    payment_intent_data: { metadata },
    success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}&courseId=${course._id}`,
    cancel_url: process.env.STRIPE_CANCEL_URL || "http://localhost:5173/checkout/cancel",
  });

  res.send({ url: session.url, sessionId: session.id });
};

/* -------------------------------------------------------------------------- */
/*  POST /api/payments/verify — confirm Stripe session after redirect          */
/* -------------------------------------------------------------------------- */

exports.verifyCheckout = async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).send({ message: "Stripe is not configured." });
  }

  const sessionId = req.body.sessionId;
  if (!sessionId) {
    return res.status(400).send({ message: "sessionId is required." });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const { courseId, studentId } = session.metadata || {};

    if (!courseId || !studentId || studentId !== req.user._id.toString()) {
      return res.status(403).send({ message: "Invalid checkout session." });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).send({ message: "Payment has not been completed." });
    }

    const enrolled = await handleCheckoutSessionCompleted(stripe, session);

    res.send({ enrolled: !!enrolled, courseId });
  } catch (err) {
    res.status(400).send({ message: err.message || "Could not verify payment." });
  }
};

/* -------------------------------------------------------------------------- */
/*  Webhook event handlers                                                     */
/* -------------------------------------------------------------------------- */

/** Stripe event: checkout.session.completed */
async function handleCheckoutSessionCompleted(stripe, session) {
  let data = session;
  if (!data.metadata?.courseId && data.id) {
    data = await stripe.checkout.sessions.retrieve(data.id);
  }
  const { courseId, studentId } = data.metadata || {};
  const amount = data.amount_total != null ? data.amount_total / 100 : undefined;
  const currency = data.currency || "usd";

  return fulfillEnrollment({
    studentId,
    courseId,
    amount,
    currency,
    status: amount === 0 ? "free" : "completed",
    stripeRef: data.id,
    stripePaymentIntentId: data.payment_intent || undefined,
  });
}

/** Stripe event: payment_intent.succeeded (fallback if session handler missed) */
async function handlePaymentIntentSucceeded(stripe, paymentIntent) {
  let { courseId, studentId } = paymentIntent.metadata || {};

  if (!courseId && paymentIntent.id) {
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntent.id,
      limit: 1,
    });
    const session = sessions.data[0];
    if (session?.metadata) {
      return handleCheckoutSessionCompleted(stripe, session);
    }
  }

  if (!courseId || !studentId) {
    return false;
  }

  const amount = paymentIntent.amount != null ? paymentIntent.amount / 100 : undefined;

  return fulfillEnrollment({
    studentId,
    courseId,
    amount,
    currency: paymentIntent.currency || "usd",
    stripeRef: paymentIntent.id,
    stripePaymentIntentId: paymentIntent.id,
  });
}

/* -------------------------------------------------------------------------- */
/*  POST /api/payments/webhook — Stripe signs raw body (see routes.js)         */
/* -------------------------------------------------------------------------- */

exports.webhook = async (req, res) => {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return res.status(503).send({ message: "Webhook not configured." });
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send({ message: `Webhook Error: ${err.message}` });
  }

  let enrolled = false;

  try {
    switch (event.type) {
      case "checkout.session.completed":
        enrolled = await handleCheckoutSessionCompleted(stripe, event.data.object);
        break;
      case "payment_intent.succeeded":
        enrolled = await handlePaymentIntentSucceeded(stripe, event.data.object);
        break;
      default:
        break;
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }

  res.json({
    received: true,
    type: event.type,
    enrolled,
  });
};

/* -------------------------------------------------------------------------- */
/*  GET /api/payments/my-courses — student enrolled courses                     */
/* -------------------------------------------------------------------------- */

exports.myCourses = async (req, res) => {
  const enrollments = await Enrollment.find({
    student: req.user._id,
    status: "active",
  })
    .populate({
      path: "course",
      populate: { path: "author", select: "name bio email" },
    })
    .sort("-purchasedAt");

  res.send(
    enrollments.map((e) => ({
      enrolledAt: e.purchasedAt,
      course: e.course,
    })),
  );
};

/* -------------------------------------------------------------------------- */
/*  GET /api/payments/check/:courseId — is current student enrolled?           */
/* -------------------------------------------------------------------------- */

exports.checkEnrollment = async (req, res) => {
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId,
    status: "active",
  });
  res.send({ enrolled: !!enrollment });
};

/* -------------------------------------------------------------------------- */
/*  Payment list helpers + API responses                                       */
/* -------------------------------------------------------------------------- */

/** Shape Payment document for API (populated student/course). */
function formatPaymentRow(p) {
  return {
    _id: p._id,
    amount: p.amount,
    currency: p.currency,
    status: p.status,
    paidAt: p.paidAt,
    stripeSessionId: p.stripeSessionId,
    student:
      p.student && typeof p.student === "object"
        ? { _id: p.student._id, name: p.student.name, email: p.student.email }
        : p.student,
    course:
      p.course && typeof p.course === "object"
        ? { _id: p.course._id, title: p.course.title, category: p.course.category }
        : p.course,
  };
}

/** GET /api/payments/my-payments — student payment history */
exports.myPayments = async (req, res) => {
  const payments = await Payment.find({ student: req.user._id })
    .populate("course", "title category price")
    .sort("-paidAt");

  res.send(payments.map(formatPaymentRow));
};

/** GET /api/payments/admin — all payments + revenue summary (admin) */
exports.adminPayments = async (req, res) => {
  const payments = await Payment.find()
    .populate("student", "name email role")
    .populate("course", "title category")
    .sort("-paidAt");

  const completed = payments.filter(
    (p) => p.status === "completed" || p.status === "free",
  );
  const totalAmount = completed.reduce((sum, p) => sum + (p.amount || 0), 0);
  const paidRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  res.send({
    payments: payments.map(formatPaymentRow),
    summary: {
      count: payments.length,
      totalAmount: Math.round(totalAmount * 100) / 100,
      paidRevenue: Math.round(paidRevenue * 100) / 100,
      freeCount: payments.filter((p) => p.status === "free").length,
      refundedCount: payments.filter((p) => p.status === "refunded").length,
    },
  });
};
