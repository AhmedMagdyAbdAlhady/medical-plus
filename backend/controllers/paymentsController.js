 /**
 * paymentsController.js
 *
 * Handles Stripe checkout, webhooks, orders, and payment records.
 * Flow: customer pays → Stripe webhook → recordPayment() → Order + Payment in DB.
 */

const Stripe = require("stripe");
const { Product } = require("../models/product");
const { Order } = require("../models/orders");
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

/** Final product price in dollars after discount, rounded to 2 decimals. */
function getProductAmount(product) {
  const discount = product.discount || 0;
  return Math.max(0, Math.round((product.price - discount) * 100) / 100);
}

/** Stripe Checkout expects amount in cents (integer). */
function getStripePrice(product) {
  return Math.round(getProductAmount(product) * 100);
}

/* -------------------------------------------------------------------------- */
/*  Core: save order + payment (idempotent)                               */
/* -------------------------------------------------------------------------- */

/**
 * Creates or updates order entries and records global Payment documents.
 * Prevents duplications if same stripeSessionId or customer+product pairing is resolved.
 *
 * @returns {boolean} true if transaction history context is successfully processed
 */
async function recordPayment({
  customerId,
  productId,
  amount,
  currency = "usd",
  status = "completed",
  stripeRef,
  stripePaymentIntentId,
}) {
  if (!customerId || !productId || !stripeRef) return false;

  // Already processed this Stripe session — still ensure order is verified
  const existingPayment = await Payment.findOne({ stripeSessionId: stripeRef });
  if (existingPayment) {
    await Order.findOneAndUpdate(
      { customer: customerId, product: productId },
      {
        customer: customerId,
        product: productId,
        stripeSessionId: stripeRef,
        status: "completed",
        purchasedAt: existingPayment.paidAt || new Date(),
      },
      { upsert: true, new: true },
    );
    return true;
  }

  // Customer already has an active payment record context for this retail item
  const existingForProduct = await Payment.findOne({
    customer: customerId,
    product: productId,
  });
  if (existingForProduct) {
    await Order.findOneAndUpdate(
      { customer: customerId, product: productId },
      {
        customer: customerId,
        product: productId,
        stripeSessionId: stripeRef,
        status: "completed",
        purchasedAt: existingForProduct.paidAt || new Date(),
      },
      { upsert: true, new: true },
    );
    return true;
  }

  const product = await Product.findById(productId);
  if (!product) return false;

  const finalAmount = amount ?? getProductAmount(product);
  const paymentStatus = status || (finalAmount === 0 ? "free" : "completed");

  // Finalize order record status updating lifecycle bounds
  await Order.findOneAndUpdate(
    { customer: customerId, product: productId },
    {
      customer: customerId,
      product: productId,
      stripeSessionId: stripeRef,
      status: "completed",
      purchasedAt: new Date(),
    },
    { upsert: true, new: true },
  );

  // Persist payment records for analytics pipelines and tax tracking
  await Payment.create({
    customer: customerId,
    product: productId,
    amount: finalAmount,
    currency,
    status: paymentStatus,
    stripeSessionId: stripeRef,
    stripePaymentIntentId: stripePaymentIntentId || undefined,
    paidAt: new Date(),
  });

  return true;
}

/** Alias utilized during continuous streaming pipeline webhooks. */
async function fulfillOrder(opts) {
  return recordPayment(opts);
}

/* -------------------------------------------------------------------------- */
/*  POST /api/payments/checkout — start Stripe Checkout (customers)           */
/* -------------------------------------------------------------------------- */

exports.createCheckout = async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).send({ message: "Stripe is not configured." });
  }

  const product = await Product.findById(req.body.productId);
  if (!product || !product.isPublished) {
    return res.status(404).send({ message: "Product not found." });
  }

  const existing = await Order.findOne({
    customer: req.customer ._id,
    product: product._id,
    status: "completed",
  });
  if (existing) {
    return res.status(400).send({ message: "You have already purchased this item." });
  }

  const unitAmount = getStripePrice(product);

  // Free product handling (promotional or clinical samples): check out immediately
  if (unitAmount <= 0) {
    const stripeRef = `free_${req.customer ._id}_${product._id}`;
    await recordPayment({
      customerId: req.customer ._id.toString(),
      productId: product._id.toString(),
      amount: 0,
      status: "free",
      stripeRef,
    });
    return res.send({
      url: `${process.env.STRIPE_SUCCESS_URL}?productId=${product._id}&free=true`,
      free: true,
    });
  }

  const metadata = {
    productId: product._id.toString(),
    customerId: req.customer ._id.toString(),
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description?.substring(0, 200),
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    metadata,
    payment_intent_data: { metadata },
    success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}&productId=${product._id}`,
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
    const { productId, customerId } = session.metadata || {};

    if (!productId || !customerId || customerId !== req.customer ._id.toString()) {
      return res.status(403).send({ message: "Invalid checkout session." });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).send({ message: "Payment has not been completed." });
    }

    const ordered = await handleCheckoutSessionCompleted(stripe, session);

    res.send({ ordered: !!ordered, productId });
  } catch (err) {
    res.status(400).send({ message: err.message || "Could not verify payment." });
  }
};

/* -------------------------------------------------------------------------- */
/*  Webhook event handlers                                                     */
/* -------------------------------------------------------------------------- */

/** Stripe webhook trigger event callback integration processing */
async function handleCheckoutSessionCompleted(stripe, session) {
  let data = session;
  if (!data.metadata?.productId && data.id) {
    data = await stripe.checkout.sessions.retrieve(data.id);
  }
  const { productId, customerId } = data.metadata || {};
  const amount = data.amount_total != null ? data.amount_total / 100 : 0;

  return await recordPayment({
    customerId,
    productId,
    amount,
    currency: data.currency || "usd",
    stripeRef: data.id,
    stripePaymentIntentId: typeof data.payment_intent === "string" ? data.payment_intent : undefined,
  });
}

// Export structural components for webhook integration routers
module.exports.fulfillOrder = fulfillOrder;
module.exports.handleCheckoutSessionCompleted = handleCheckoutSessionCompleted;

exports.webhook = async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).send({ message: "Stripe is not configured." });
  }

  let event;
  try {
    event = JSON.parse(req.body);
  } catch (err) {
    return res.status(400).send({ message: "Invalid webhook payload." });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await handleCheckoutSessionCompleted(stripe, session);
  }

  res.status(200).send({ received: true });
};

exports.myProducts = async (req, res) => {
  const orders = await Order.find({ customer: req.customer._id, status: "completed" })
    .populate("product", "name image price")
    .sort("-purchasedAt");
  res.send(orders);
};

exports.myPayments = async (req, res) => {
  const payments = await Payment.find({ customer: req.customer._id })
    .populate("product", "name")
    .sort("-paidAt");
  res.send(payments);
};

exports.checkEnrollment = async (req, res) => {
  const order = await Order.findOne({
    customer: req.customer._id,
    product: req.params.productId,
    status: "completed",
  });
  res.send({ enrolled: !!order });
};

exports.adminPayments = async (req, res) => {
  const payments = await Payment.find()
    .populate("customer", "name email")
    .populate("product", "name")
    .sort("-paidAt");
  res.send(payments);
};
