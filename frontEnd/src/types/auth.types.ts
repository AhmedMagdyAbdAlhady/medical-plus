/** Payload sent to the login endpoint */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/** Payload sent to the signup endpoint */
export interface SignupCredentials {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  location: string;
  agreeToTerms: boolean;
}

/** Contact-form on the FAQ page */
export interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}
