import React from "react";
import LoginForm from "../../features/auth/components/LoginForm";

/**
 * Login page component.
 * Delegates the complex form UI to features/auth/components/LoginForm.
 */
const Login: React.FC = () => {
  return (
    <>
      <main>
        <section className="content-section-bg">
        {/* <section > */}
          <div className="container">
            <LoginForm />
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;
