import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

/**
 * Reusable Bootstrap-styled form input.
 * Shared between Login and Signup pages.
 */
const FormInput: React.FC<FormInputProps> = ({ label, id, error, ...rest }) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input id={id} className={`form-control${error ? " is-invalid" : ""}`} {...rest} />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default FormInput;
