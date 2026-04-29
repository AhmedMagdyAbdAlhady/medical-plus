import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../../images/logo.png";
import cartImg from "../../images/carty.png";
import phoneImg from "../../images/phone-call.png";
import "../../styles/global.css";
import "./nav.module.css";

const Header: React.FC = () => {
  return (
    <header className="bg-white">
      {/* ── Top Bar: Logo / Search / Actions ── */}
      <div className="container py-3">
        <div className="row align-items-center g-3">
          {/* Logo */}
          <div className="col-6 col-lg-3">
            <Link to="/" className="d-block">
              <img src={logoImg} alt="SereneMeds Logo" className="img-fluid logo-main" />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="col-12 col-lg-5 order-3 order-lg-2">
            <div className="input-group search-bar-custom">
              <span className="input-group-text bg-light border-end-0 rounded-start-pill text-muted">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0 border-end-0"
                placeholder="Search for products"
              />
              <button className="btn btn-primary rounded-end-pill px-4" type="button">
                Search
              </button>
            </div>
          </div>

          {/* User Actions */}
          <div className="col-6 col-lg-4 order-2 order-lg-3">
            <div className="d-flex justify-content-end align-items-center gap-3">
              {/* Cart */}
              <Link
                to="/cart"
                className="position-relative text-dark me-2 d-flex align-items-center text-decoration-none"
              >
                <img src={cartImg} alt="Cart" className="icon-cart" />
              </Link>

              {/* Language & Account */}
              <div className="d-none d-md-flex align-items-center gap-3">
                <a href="#" className="text-decoration-none text-secondary fw-bold text-sm">
                  EN <i className="fas fa-chevron-down small"></i>
                </a>
                <Link to="/login" className="text-decoration-none text-primary fw-medium">
                  <i className="far fa-user me-1"></i> My Account
                </Link>
              </div>

              {/* Support (desktop only) */}
              <div className="d-none d-xl-flex align-items-center text-end lh-1">
                <img src={phoneImg} alt="Call Us" className="me-2 icon-phone" />
                <div>
                  <small className="text-muted d-block support-text-sm">
                    Sales &amp; Service Support
                  </small>
                  <span className="fw-bold text-dark">021 344 1122</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation (dark strip) ── */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark-blue py-0">
        <div className="container">
          <button
            className="navbar-toggler py-1 my-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
            <small>Menu</small>
          </button>

          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav w-100 justify-content-between text-uppercase small fw-bold">
              {[
                "Beauty Care",
                "Sports Nutrition",
                "Nutrition Supplements",
                "Home Healthcare",
                "Mother & Baby Care",
                "Personal Care",
                "Medicines",
              ].map((item) => (
                <li key={item} className="nav-item">
                  <Link className="nav-link text-white py-2" to={`/products/${item.toLowerCase()}`}>
                    {item}
                  </Link>
                </li>
              ))}
              <li className="nav-item">
                <Link className="nav-link text-white py-2" to="/category">
                  <i className="fas fa-asterisk me-1"></i> Shop By Brands
                </Link>
              </li>
              <li className="nav-item border-0">
                <Link className="nav-link text-white py-2" to="/category">
                  <i className="fas fa-tag me-1"></i> Offers
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
