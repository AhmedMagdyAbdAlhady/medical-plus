import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { ContactFormData } from "../../types/auth.types";
import { isValidEmail, isRequired, minLength } from "../../utils/validators";
import styles from "./faq.module.css";

type ContactErrors = Partial<Record<keyof ContactFormData, string>>;

const FAQ: React.FC = () => {
  /* ── Contact-form state ── */
  const [contactForm, setContactForm] = useState<ContactFormData>({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ── Validate contact form ── */
  const validate = (data: ContactFormData): ContactErrors => {
    const e: ContactErrors = {};

    if (!isRequired(data.fullName)) {
      e.fullName = "Full name is required.";
    } else if (!minLength(data.fullName, 3)) {
      e.fullName = "Full name must be at least 3 characters.";
    }

    if (!isRequired(data.email)) {
      e.email = "Email address is required.";
    } else if (!isValidEmail(data.email)) {
      e.email = "Please enter a valid email address.";
    }

    if (!isRequired(data.subject)) {
      e.subject = "Subject is required.";
    } else if (!minLength(data.subject, 5)) {
      e.subject = "Subject must be at least 5 characters.";
    }

    if (!isRequired(data.message)) {
      e.message = "Message is required.";
    } else if (!minLength(data.message, 20)) {
      e.message = "Message must be at least 20 characters.";
    }

    return e;
  };

  /* ── Live re-validate after first submit attempt ── */
  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updated = { ...contactForm, [name]: value };
    setContactForm(updated);
    if (submitted) setErrors(validate(updated));
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setSuccess(false);
    const validationErrors = validate(contactForm);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    // TODO: wire up to API layer
    console.log("Contact form submitted:", contactForm);
    setSuccess(true);
    setContactForm({ fullName: "", email: "", subject: "", message: "" });
    setSubmitted(false);
    setErrors({});
  };

  /* ── Helper: class string for a raw input/textarea ── */
  const fieldClass = (error?: string) =>
    `form-control py-3 bg-light border-light-subtle${error ? " is-invalid" : ""}`;

  return (
    <>
      <main>
        {/* ── Hero ── */}
        <section className={`${styles.faqHero} py-5`}>
          <div className="container text-center">
            <h1 className="display-4 fw-bold text-white mb-0">FAQS</h1>
            <div className={`${styles.separator} mx-auto mt-3`}></div>
          </div>
        </section>

        {/* ── Breadcrumb ── */}
        <div className="container py-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-muted text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item active text-primary fw-bold" aria-current="page">
                Contact us
              </li>
            </ol>
            <hr className="mt-2 text-muted-light" />
          </nav>
        </div>

        {/* ── Contact Form ── */}
        <section className="contact-section py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">

                {/* Success banner */}
                {success && (
                  <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                    <i className="fas fa-circle-check me-2"></i>
                    <span>Your message was sent successfully. We&apos;ll get back to you soon!</span>
                  </div>
                )}

                <form className={styles.contactForm} onSubmit={handleContactSubmit} noValidate>
                  {/* Full Name & Email */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="fullName"
                        className={fieldClass(errors.fullName)}
                        placeholder="Full Name"
                        value={contactForm.fullName}
                        onChange={handleContactChange}
                        aria-label="Full Name"
                      />
                      {errors.fullName && (
                        <div className="invalid-feedback">{errors.fullName}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <input
                        type="email"
                        name="email"
                        className={fieldClass(errors.email)}
                        placeholder="Email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        aria-label="Email Address"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mb-3">
                    <input
                      type="text"
                      name="subject"
                      className={fieldClass(errors.subject)}
                      placeholder="Subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      aria-label="Subject"
                    />
                    {errors.subject && (
                      <div className="invalid-feedback">{errors.subject}</div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="mb-4">
                    <textarea
                      name="message"
                      className={fieldClass(errors.message)}
                      rows={6}
                      placeholder="Message (minimum 20 characters)"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      aria-label="Message"
                    ></textarea>
                    {errors.message && (
                      <div className="invalid-feedback">{errors.message}</div>
                    )}
                    <small className="text-muted">
                      {contactForm.message.length} / 20 characters minimum
                    </small>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2 fw-bold text-uppercase"
                  >
                    Submit Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact Information ── */}
        <section className={`${styles.contactInfoSection} py-5 bg-white mb-5`}>
          <div className="container">
            <h2 className="text-center fw-bold text-dark-blue mb-4">
              Contact Information
            </h2>
            <div className="row g-4 justify-content-center">
              {/* Contact card */}
              <div className="col-md-10 col-lg-8">
                <div className={`${styles.contactCard} bg-white border rounded-4 p-4 text-center shadow-sm`}>
                  <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 gap-md-5">
                    <div>
                      <p className="mb-1 text-muted small text-uppercase fw-bold">Email</p>
                      <p className="mb-0 fw-bold text-dark-blue fs-5">info@serenemeds.com</p>
                    </div>
                    <div className="d-none d-md-block border-end align-self-stretch mx-2"></div>
                    <div>
                      <p className="mb-1 text-muted small text-uppercase fw-bold">Phone</p>
                      <p className="mb-0 fw-bold text-dark-blue fs-5">(972) 532-7473</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="col-md-10 col-lg-8">
                <div className={`${styles.mapContainer} rounded-4 overflow-hidden shadow-sm position-relative`}>
                  <div
                    className="w-100 bg-secondary d-flex align-items-center justify-content-center text-white"
                    style={{ height: 350 }}
                  >
                    <span>Map – replace with Google Maps embed</span>
                  </div>
                  <div
                    className={`${styles.mapOverlayCard} position-absolute top-0 start-0 m-3 bg-white p-3 rounded shadow-sm`}
                    style={{ maxWidth: 200 }}
                  >
                    <p className="mb-1 fw-bold small">16610 Dallas Pkwy</p>
                    <p className={`mb-2 text-muted ${styles.xSmall}`}>
                      16610 Dallas Pkwy, Dallas, TX 75248, USA
                    </p>
                    <a href="#" className={`text-primary ${styles.xSmall} text-decoration-none`}>
                      View larger map
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

    </>
  );
};

export default FAQ;
