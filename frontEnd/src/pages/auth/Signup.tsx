import React from "react";
import SignupForm from "../../features/auth/components/SignupForm";

/**
 * Signup page component.
 * Delegates the complex form UI to features/auth/components/SignupForm.
 */
const Signup: React.FC = () => {
  return (
    <>

      <main>
        <section className="content-section-bg">
          <div className="container">
            <SignupForm />
          </div>
        </section>
      </main>

    </>
  );
};

export default Signup;
