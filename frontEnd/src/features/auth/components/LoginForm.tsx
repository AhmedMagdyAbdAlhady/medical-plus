import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { LoginCredentials } from "../../../types/auth.types";
import FormInput from "../../../components/FormInput";
import { isValidEmail, isRequired } from "../../../utils/validators";
import { loginUser } from "../../../store/authSlice";
import { loadCartForCurrentUser } from "../../../store/cartSlice";
import type { RootState, AppDispatch } from "../../../store/store";
import styles from "./auth.module.css";

type LoginErrors = Partial<Record<keyof LoginCredentials, string>>;

/**
 * Login form feature component.
 * Contains all form state and validation logic.
 */
const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

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
    } else if (!isValidEmail(data.email)) {
      e.email = "Please enter a valid email address.";
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const validationErrors = validate(credentials);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return; // stop if invalid

    try {
      const resultAction = await dispatch(loginUser(credentials));
      if (loginUser.fulfilled.match(resultAction)) {
        dispatch(loadCartForCurrentUser());
        toast.success(`Welcome back, ${resultAction.payload.user.name}!`);
        // If user is admin (pharmacy), redirect to dashboard, otherwise home
        if (resultAction.payload.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/home");
        }
      } else {
        toast.error(resultAction.payload as string || "Failed to login. Please try again.");
      }
    } catch (err: any) {
      toast.error("An error occurred during login.");
    }
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
          <button
            type="button"
            onClick={() => toast.info("Password recovery is disabled for the demo. Default credentials: user@medicalplus.com / password123")}
            className="btn btn-link text-decoration-none small text-primary fw-bold p-0 border-0 bg-transparent align-baseline"
          >
            Forgot Password?
          </button>
        </div>

        <button type="submit" className={`btn btn-primary ${styles.btnAuth} text-white`} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
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
