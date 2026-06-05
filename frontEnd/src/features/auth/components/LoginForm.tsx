import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { LoginCredentials } from "../../../types/auth.types";
import FormInput from "../../../components/FormInput";
import { isGmailEmail, isRequired } from "../../../utils/validators";
import styles from "./auth.module.css";

type LoginErrors = Partial<Record<keyof LoginCredentials, string>>;

/**
 * Login form feature component.
 * Contains all form state and validation logic.
 */
const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitted, setSubmitted] = useState(false);

  /* ── Validate all fields, return true if clean ── */
  const validate = (data: LoginCredentials): LoginErrors => {
    const e: LoginErrors = {};

    if (!isRequired(data.email)) {
      e.email = "Email address is required.";
    } else if (!isGmailEmail(data.email)) {
      e.email = "Please enter a valid @gmail.com address.";
    }

    if (!isRequired(data.password)) {
      e.password = "Password is required.";
    } else if (data.password.length < 6) {
      e.password = "Password must be at least 6 characters.";
    }

    return e;
  };

  /* ── Live re-validate after first submit attempt ── */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
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
    if (Object.keys(validationErrors).length > 0) return; // stop if invalid
    // TODO: dispatch a login thunk / call the auth API
    console.log("Login payload:", credentials);
  };

  return (
    <div className={styles.authCard}>
      <div className={styles.authHeader}>
        <h2>Welcome Back</h2>
        <p>Login to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
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

        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={credentials.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={credentials.rememberMe}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember Me
            </label>
          </div>
          <a href="#" className="text-decoration-none small text-primary fw-bold">
            Forgot Password?
          </a>
        </div>

        <button type="submit" className={`btn btn-primary ${styles.btnAuth} text-white`}>
          Login
        </button>

        <div className={styles.authLinks}>
          <p className="mb-0">
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
