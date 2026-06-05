import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { SignupCredentials } from "../../../types/auth.types";
import FormInput from "../../../components/FormInput";
import {
  isGmailEmail,
  isEgyptianPhone,
  isStrongPassword,
  isRequired,
} from "../../../utils/validators";
import styles from "./auth.module.css";

const LOCATIONS = ["Cairo", "Alexandria", "Giza", "Mansoura", "Other"];

type SignupErrors = Partial<Record<keyof SignupCredentials, string>>;

/**
 * Signup form feature component.
 * Contains all form state and validation logic.
 */
const SignupForm: React.FC = () => {
  const [credentials, setCredentials] = useState<SignupCredentials>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<SignupErrors>({});
  const [submitted, setSubmitted] = useState(false);

  /* ── Validate all fields ── */
  const validate = (data: SignupCredentials): SignupErrors => {
    const e: SignupErrors = {};

    // Full Name
    if (!isRequired(data.fullName)) {
      e.fullName = "Full name is required.";
    } else if (data.fullName.trim().length < 3) {
      e.fullName = "Full name must be at least 3 characters.";
    }

    // Email — must be @gmail.com
    if (!isRequired(data.email)) {
      e.email = "Email address is required.";
    } else if (!isGmailEmail(data.email)) {
      e.email = "Please enter a valid @gmail.com address.";
    }

    // Egyptian phone number
    if (!isRequired(data.phone)) {
      e.phone = "Phone number is required.";
    } else if (!isEgyptianPhone(data.phone)) {
      e.phone = "Enter a valid Egyptian number (e.g. 01012345678).";
    }

    // Password strength
    if (!isRequired(data.password)) {
      e.password = "Password is required.";
    } else if (!isStrongPassword(data.password)) {
      e.password = "Password must be at least 8 characters and include a letter and a number.";
    }

    // Confirm password
    if (!isRequired(data.confirmPassword)) {
      e.confirmPassword = "Please confirm your password.";
    } else if (data.password !== data.confirmPassword) {
      e.confirmPassword = "Passwords do not match.";
    }

    // Location
    if (!isRequired(data.location)) {
      e.location = "Please select your location.";
    }

    // Terms
    if (!data.agreeToTerms) {
      e.agreeToTerms = "You must agree to the Terms & Conditions to continue.";
    }

    return e;
  };

  /* ── Live re-validate after first submit attempt ── */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    const updated = {
      ...credentials,
      [name]: type === "checkbox" ? checked : value,
    };
    setCredentials(updated);
    if (submitted) setErrors(validate(updated));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const validationErrors = validate(credentials);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    // TODO: dispatch a signup thunk / call the auth API
    console.log("Signup payload:", credentials);
  };

  return (
    <div className={`${styles.authCard} ${styles.signupCard}`}>
      <div className={styles.authHeader}>
        <h2>Create Account</h2>
        <p>Join us to get the best medical products</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <FormInput
          id="fullName"
          name="fullName"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={credentials.fullName}
          onChange={handleChange}
          error={errors.fullName}
          autoComplete="name"
        />

        {/* Email & Phone row */}
        <div className="row">
          <div className="col-md-6">
            <FormInput
              id="email"
              name="email"
              label="Email Address"
              type="email"
              placeholder="yourname@gmail.com"
              value={credentials.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />
          </div>
          <div className="col-md-6">
            <FormInput
              id="phone"
              name="phone"
              label="Phone Number"
              type="tel"
              placeholder="01012345678"
              value={credentials.phone}
              onChange={handleChange}
              error={errors.phone}
              autoComplete="tel"
            />
          </div>
        </div>

        {/* Password row */}
        <div className="row">
          <div className="col-md-6">
            <FormInput
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Min. 8 chars + a number"
              value={credentials.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
            />
          </div>
          <div className="col-md-6">
            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              value={credentials.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
          </div>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <select
            className={`form-select${errors.location ? " is-invalid" : ""}`}
            id="location"
            name="location"
            value={credentials.location}
            onChange={handleChange}
          >
            <option disabled value="">
              Choose your location...
            </option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {errors.location && (
            <div className="invalid-feedback">{errors.location}</div>
          )}
        </div>

        {/* Terms checkbox */}
        <div className="form-check mb-4">
          <input
            className={`form-check-input${errors.agreeToTerms ? " is-invalid" : ""}`}
            type="checkbox"
            id="terms"
            name="agreeToTerms"
            checked={credentials.agreeToTerms}
            onChange={handleChange}
          />
          <label className="form-check-label small" htmlFor="terms">
            I agree to the{" "}
            <a href="#" className="text-primary">
              Terms &amp; Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary">
              Privacy Policy
            </a>
          </label>
          {errors.agreeToTerms && (
            <div className="invalid-feedback d-block">{errors.agreeToTerms}</div>
          )}
        </div>

        <button type="submit" className={`btn btn-primary ${styles.btnAuth} text-white`}>
          Sign Up
        </button>

        <div className={styles.authLinks}>
          <p className="mb-0">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
