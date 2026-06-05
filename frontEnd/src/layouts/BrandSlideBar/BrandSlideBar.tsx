import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import style from "./BrandSlideBar.module.css";
const BrandSlideBar = () => {
  let brand = [
    {
      number: 0,
      items: [
        {
          id: 1,
          name: "Brand 1",
          image: "/images/Brands/brand1.webp",
        },
        {
          id: 2,
          name: "Brand 2",
          image: "/images/Brands/brand2.webp",
        },
        {
          id: 3,
          name: "Brand 3",
          image: "/images/Brands/brand3.webp",
        },
        {
          id: 4,
          name: "Brand 4",
          image: "/images/Brands/brand4.webp",
        },
        {
          id: 5,
          name: "Brand 5",
          image: "/images/Brands/brand5.webp",
        },
        {
          id: 6,
          name: "Brand 6",
          image: "/images/Brands/brand6.webp",
        },
        {
          id: 7,
          name: "Brand 7",
          image: "/images/Brands/brand7.webp",
        },
      ],
    },
    {
      number: 1,
      items: [
        {
          id: 1,
          name: "Brand 1",
          image: "/images/Brands/brand1.webp",
        },
        {
          id: 2,
          name: "Brand 2",
          image: "/images/Brands/brand2.webp",
        },
        {
          id: 7,
          name: "Brand 7",
          image: "/images/Brands/brand7.webp",
        },
        {
          id: 3,
          name: "Brand 3",
          image: "/images/Brands/brand3.webp",
        },
        
        {
          id: 5,
          name: "Brand 5",
          image: "/images/Brands/brand5.webp",
        },
        {
          id: 4,
          name: "Brand 4",
          image: "/images/Brands/brand4.webp",
        },
        {
          id: 6,
          name: "Brand 6",
          image: "/images/Brands/brand6.webp",
        },
        
      ],
    },
  ];

  return (
    <>
      {/* <!-- Start Brand/Logo Carousel--> */}
      <section className={`"${style.logoSlider} py-4 bg-white"`}>
        <div className="container">
          <div className="logo-carousel-wrapper">
            <div
              id="logoCarousel"
              className="carousel slide logo-carousel"
              data-bs-ride="carousel"
              data-bs-interval="4000"
            >
              <div className="carousel-inner">
                {brand.map((b, index) => {
                  return (
                    <div
                      className={`carousel-item  ${index == 0 ? " active" : ""}`}
                      key={b.number || index}
                    >
                      <div className={style.logoRow}>
                        {b.items.map((item) => {
                          return (
                            <div className={style.logoItem}>
                              <img
                                src={item.image}
                                alt={item.name}
                                className={style.logoImg}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* <!-- Navigation Buttons --> */}
                <button
                  className={`carousel-control-prev ${style.logoNav}`}
                  type="button"
                  data-bs-target="#logoCarousel"
                  data-bs-slide="prev"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className={style.logoNavIcon} />
                </button>
                <button
                  className={`carousel-control-next ${style.logoNav}`}
                  type="button"
                  data-bs-target="#logoCarousel"
                  data-bs-slide="next"
                >
                    <FontAwesomeIcon icon={faChevronRight} className={style.logoNavIcon} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- End Brand /Logo Carousel--> */}
    </>
  );
};
export default BrandSlideBar;
