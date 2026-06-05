import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import style from "./home.module.css";
import heroImage from "../../images/Design 1.webp";
import Card from "../../components/card/card";
import FileUpload from "../../components/FileUpload/FileUpload";
import BrandSlideBar from "../../layouts/BrandSlideBar/BrandSlideBar";
import PopularProducts from "../../layouts/PopularProducts/PopularProducts";
import BestForLess from "../../layouts/BestForLess/BestForLess";
const products = [
  {
    number: 1,
    item: [
      {
        id: 1,
        name: "Betadine Mouthwash And Gargle 250 Ml",
        category: "Sore Throat, Mouthwash/Gargle",
        price: 49.6,
        image: "/images/product1.webp",
      },
      {
        id: 2,
        name: "Panadol Extra 500mg",
        category: "Pain Relief",
        price: 30.0,
        image: "/images/product2.webp",
      },
      {
        id: 3,
        name: "Brufen 400mg Tablets",
        category: "Anti-inflammatory",
        price: 45.0,
        image: "/images/product3.webp",
      },
      {
        id: 4,
        name: "Otrivin Nasal Spray",
        category: "Nasal Care",
        price: 55.0,
        image: "/images/product4.webp",
      },
    ],
  },
  {
    number: 2,
    item: [
      {
        id: 1,
        name: "Betadine Mouthwash And Gargle 250 Ml",
        category: "Sore Throat, Mouthwash/Gargle",
        price: 49.6,
        image: "/images/product1.webp",
      },
      {
        id: 2,
        name: "Panadol Extra 500mg",
        category: "Pain Relief",
        price: 30.0,
        image: "/images/product2.webp",
      },
      {
        id: 3,
        name: "Brufen 400mg Tablets",
        category: "Anti-inflammatory",
        price: 45.0,
        image: "/images/product3.webp",
      },
      {
        id: 4,
        name: "Otrivin Nasal Spray",
        category: "Nasal Care",
        price: 55.0,
        image: "/images/product4.webp",
      },
    ],
  },
];
const discount = () => {
  alert(
    "Congratulations! You've received a 20% discount on your order. Use code: MED20 at checkout.",
  );
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
              <p className={style.availability}>
                We're available 24/7, Order Now &
              </p>
              <button onClick={discount} className={"btn " + style.btnDiscount}>
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
      {/* <!-- Strat carousel Instant Pharmacy --> */}
      <section className={style.productSlider + " py-5"}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4 section-header">
            <div className="d-flex align-items-center">
              <h2 className={style.sectionTitle}>Instant Pharmacy</h2>
              <span className={style.deliveryNote + "text-muted ms-2"}>
                (Delivered In 30mins)
              </span>
            </div>
            <a href="#" className={"btn " + style.btnViewAll + " px-4 py-2"}>
              View All
            </a>
          </div>
          <div
            id="pharmacyCarousel"
            className={` ${style.pharmacyCarousel} carousel slide`}
            data-bs-ride="carousel"
            data-bs-interval="3000"
          >
            {/* <!-- Carousel Indicators --> */}
            <div className={`carousel-indicators ${style.customDots}`}>
              {products.map((p, index) => {
                return (
                  <button
                    key={p.number || index}
                    type="button"
                    data-bs-target="#pharmacyCarousel"
                    data-bs-slide-to={index}
                    className={index == 0 ? "active" : ""}
                    aria-current={index == 0 ? "true" : undefined}
                    aria-label={`Slide ${index + 1}`}
                  ></button>
                );
              })}
            </div>

            <div className="carousel-inner">
              {products.map((p, index) => {
                return (
                  <div
                    key={p.number || index}
                    className={"carousel-item" + (index == 0 ? " active" : "")}
                    data-bs-interval="3000"
                  >
                    <div className="row g-3">
                      {p.item.map((product) => {
                        return (
                          <Card
                            key={product.id}
                            page="home"
                            id={product.id}
                            productName={product.name}
                            category={product.category}
                            price={Number(product.price)}
                            imageSrc={product.image}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* <!-- Navigation Buttons --> */}
            <button
              className={`carousel-control-prev   start-0 ${style.customNav}`}
              type="button"
              data-bs-target="#pharmacyCarousel"
              data-bs-slide="prev"
            >
              <span className="visually-hidden">Previous</span>
              <FontAwesomeIcon icon={faChevronLeft} className={style.navIcon} />
            </button>
            <button
              className={`carousel-control-next   end-0 ${style.customNav}`}
              type="button"
              data-bs-target="#pharmacyCarousel"
              data-bs-slide="next"
            >
              <span className="visually-hidden">Next</span>
              <FontAwesomeIcon
                icon={faChevronRight}
                className={style.navIcon}
              />
            </button>
          </div>
        </div>
      </section>
      {/* <!-- End carousel Instant Pharmacy --> */}
      <FileUpload />
      <BrandSlideBar />
      <PopularProducts/>
      <BestForLess/>
    </>
  );
};
export default home;
