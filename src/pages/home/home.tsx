import React, { useState } from "react";
import style from "./home.module.css";
import heroImage from "../../images/Design 1.webp";

const discount = () => {    
    alert("Congratulations! You've received a 20% discount on your order. Use code: MED20 at checkout.");
};
const home = () => {
  return (
    <>
      {/* <!-- Start hero Section --> */}
      <section className={style.heroSection + " d-flex align-items-center"}>
        <div className={style.shape + " " + style.circle1}></div>
        <div className={style.shape + " " + style.circle2}></div>
        <div className={style.shape + " " + style.circle3}></div>

        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 text-content">
              <h2 className={style.subHeadline}>ONE STOP</h2>
              <h1 className={style.mainHeadline}>SOLUTION</h1>
              <p className={style.tagline}>to all your medicine needs</p>
              <hr className={style.shortLine} />
              <p className={style.availability}>We're available 24/7, Order Now &</p>
              <button onClick={discount} className={"btn " + style.btnDiscount} >
                GET AN INSTANT 20% OFF
              </button>
            </div>

            <div className="col-lg-6 text-center mt-5 mt-lg-0">
              <img
                src={heroImage}
                alt="Medical App Design"
                className={"img-fluid" + style.heroImg} 
              />
            </div>
          </div>
        </div>
      </section>
      {/* <!-- End hero Section --> */}
      
    </>
  );
};

export default home;
