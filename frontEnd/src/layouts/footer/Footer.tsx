import React from "react";
import logoImg from "../../images/logo.png";
import bgPolygon from "../../images/bg-polygon 1.png";
import "../../styles/global.css";
import "./footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className="bg-light-footer pt-5 position-relative footer-offset">
      {/* Background polygon decoration */}
      <img
        src={bgPolygon}
        alt=""
        aria-hidden="true"
        className="position-absolute bottom-0 start-0 d-none d-lg-block footer-polygon-bg"
      />

      {/* ── Newsletter (floating overlap) ── */}
      <div className="container position-relative z-1 newsletter-wrapper">
        <div className="bg-white rounded-4 shadow p-4 p-lg-5 text-center mx-auto newsletter-card">
          <h3 className="fw-bold text-dark-blue mb-2">Join Our Newsletter</h3>
          <div className="d-flex justify-content-center mb-3">
            <span className="bg-primary rounded-circle newsletter-dot"></span>
          </div>
          <p className="text-muted mb-4">
            Join over half a million vitamin lovers and get our latest deals,
            articles, and resources!
          </p>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control bg-light border-0 py-3 ps-4"
                  placeholder="example@example.com"
                  aria-label="Newsletter email"
                />
                <button className="btn btn-primary px-4 fw-bold" type="button">
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Content ── */}
      <div className="container pt-5 pb-4 position-relative z-1">
        <div className="row g-4 text-center text-md-start">
          {/* Brand & Social */}
          <div className="col-lg-4 col-md-6">
            <img
              src={logoImg}
              alt="SereneMeds"
              className="mb-3 footer-brand-logo"
            />
            <p className="text-muted small mb-4">
              SereneMeds - Corporate Office <br />
              Marasi Dr - Business Bay Square
            </p>
            <div className="social-icons">
              <a
                href="#"
                className="btn btn-dark rounded-circle btn-sm me-1"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="btn btn-dark rounded-circle btn-sm me-1"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="btn btn-dark rounded-circle btn-sm me-1"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="#"
                className="btn btn-dark rounded-circle btn-sm me-1"
                aria-label="Twitter / X"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          {/* Who We Are */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold text-dark-blue mb-3">Who We Are</h5>
            <ul className="list-unstyled text-muted small lh-lg">
              {[
                "About SereneMeds",
                "Contact Us",
                "Latest News",
                "Store Locator",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-decoration-none text-muted">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Policies */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold text-dark-blue mb-3">Our Policies</h5>
            <ul className="list-unstyled text-muted small lh-lg">
              {[
                "Refund Policy",
                "Shipping Terms",
                "Privacy Policy",
                "Terms & Conditions",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-decoration-none text-muted">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold text-dark-blue mb-3">Useful Links</h5>
            <ul className="list-unstyled text-muted small lh-lg mb-4">
              {["Browse By Brand", "Browse By Category", "Offers/Coupons"].map(
                (item) => (
                  <li key={item}>
                    <a href="#" className="text-decoration-none text-muted">
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Copyright ── */}
      <div className="border-top border-light-subtle position-relative z-1">
        <div className="container py-3">
          <div className="row align-items-center">
            <div className="col-12 text-center text-md-start">
              <p className="mb-0 small text-muted">
                &copy; {new Date().getFullYear()} SereneMeds. All Rights
                Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
