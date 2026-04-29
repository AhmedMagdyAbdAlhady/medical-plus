import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../layouts/header/Header";
import Footer from "../layouts/footer/Footer";
import Products from "../pages/products/products";
import ProductDetails from "../pages/productDetails/productDetails";

/* ─── Lazy-loaded pages ─────────────────────────────────────────────────── */
const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const FAQ = lazy(() => import("../pages/faq/FAQ"));
const HOME = lazy(() => import("../pages/home/home"));

/* ─── Loading fallback ──────────────────────────────────────────────────── */
const PageSpinner: React.FC = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "60vh" }}
  >
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading…</span>
    </div>
  </div>
);

/**
 * Central route configuration.
 * Add new routes here to keep App.tsx clean.
 */
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          {/* Auth */}
          <Route
            path="/login"
            element={
              <>
                <Header />
                <Login />
                <Footer />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Header />
                <Signup />
                <Footer />
              </>
            }
          />
          {/* Info */}
          <Route
            path="/faq"
            element={
              <>
                <Header />
                <FAQ />
                <Footer />
              </>
            }
          />
          <Route
            path="/home"
            element={
              <>
                <Header />
                <HOME />
                <Footer />
              </>
            }
          />
          <Route
            path="/Products/:category?"
            element={
              <>
                <Header />
                <Products />
                <Footer />
              </>
            }
          />{" "}
          <Route
            path="/Product/:id"
            element={
              <>
                <Header />
                <ProductDetails />
                <Footer />
              </>
            }
          />
          {/* Catch-all → redirect to login for now */}
          <Route
            path="*"
            element={
              <>
                <Header />
                <HOME />
                <Footer />
              </>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
