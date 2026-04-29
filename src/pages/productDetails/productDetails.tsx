import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { AllProducts } from "../../api/data";
import TitlePage from "../../layouts/TitlePage/TitlePage";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Card from "../../components/card/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  // 1. Find Current Product
  const product = AllProducts.find((p) => p.id === Number(id));

  if (!product) {
    return <div className="text-center m-5 text-danger fw-bold fs-1">Product not found</div>;
  }

  // 2. Filter Related Products
  const relatedProducts = AllProducts.filter((p) =>
    product.productRelated?.includes(p.id)
  );

  const BreadcrumbItem = [
    { label: product.category, href: `/Products/${product.category}` },
    { label: product.name, href: "#" },
  ];

  return (
    <>
      <TitlePage title={product.name} />
      <div className="container mt-4">
        <Breadcrumb items={BreadcrumbItem} />

        {/* Product Details Section */}
        <div className="row g-5 border-bottom pb-4 mt-2">
          {/* Image */}
          <div className="col-md-5 text-center">
            <div className="product-image">
              <img src={product.image} alt={product.name} className="img-fluid" />
            </div>
          </div>

          {/* Details */}
          <div className="col-md-7 d-flex flex-column justify-content-evenly">
            <div className="position-relative">
              <h4 className="product-title">{product.name}</h4>
              <p className="brand">
                Brand: <span>{product.brand || "N/A"}</span>
              </p>
              <span className="price-badge position-absolute top-0 end-0 px-4 border border-2">
                Rs. {product.price}
              </span>
            </div>

            <div className="info mt-3">
              <h6>Used For:</h6>
              <ul>
                <li>{product.usedFor || "General Relief"}</li>
              </ul>
            </div>

            <div className="info">
              <h6>How it works:</h6>
              <ul>
                <li>{product.howItWorks || "Information not available."}</li>
              </ul>
            </div>

            <div className="info">
              <h6>Generics:</h6>
              <ul>
                <li>{product.generics || "N/A"}</li>
              </ul>
            </div>

            {/* Cart Logic */}
            <div className="cart-quantity shadow d-flex justify-content-evenly align-items-center gap-3 mt-4 p-2">
              <div className="quantity-box border   border-dark rounded">
                <button  type="button" className="btn " onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}>-</button>
                <span className="px-3">{quantity}</span>
                <button   type="button" className="btn " onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>
              <button className="btn btn-primary px-5">
                <FontAwesomeIcon icon={faCartShopping} className="me-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="col-12 mt-4 description">
          <h6>Precaution</h6>
          <ul>
            <li>{product.precautions}</li>
          </ul>

          <h6>Side Effects</h6>
          <ul>
            <li>{product.sideEffects}</li>
          </ul>

          <h6>Indication</h6>
          <ul>
            <li>{product.discription}</li>
          </ul>
        </div>

        {/* Related Products Section */}
        <section className="related-products py-5 bg-white">
          <div className="container">
            <div className="row">
              <div className="col-12 d-flex align-items-center justify-content-center mb-4">
                <h2 className="section-title">You May Also Like</h2>
              </div>
              <div className="col-12 row g-4">
                {relatedProducts.map((item) => (
                 <Card
                    key={item.id}
                    id={item.id}
                    productName={item.name}
                    category={item.category}
                    price={Number(item.price)}
                    imageSrc={item.image}
                    page="home"
                  />))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProductDetails;
