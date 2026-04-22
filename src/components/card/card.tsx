import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

import cardStyles from "./card.module.css";

interface CardProps {
  page?: "home" | "product";
  id: number;
  productName: string;
  imageSrc: string;
  price: number;
  category: string;
}
function addToCart(productId: number) {
  // Implement the logic to add the product to the cart
  console.log(`Product added to cart: ${productId}`);
}
const Card = ({
  productName,
  imageSrc,
  price,
  category,
  page,
  id,
}: CardProps) => {
  return (
    <div key={id} className="col-12 col-sm-12 col-md-6 col-lg-3">
      <div
        className={
          page == "home" ? cardStyles["home-card"] : cardStyles["product-card"]
        }
      >
        <div className={cardStyles["product-image"]}>
          <img src={imageSrc} alt={productName} />
        </div>
        <div
          className={`${cardStyles["product-info"]} d-flex flex-column justify-content-between`}
        >
          <div>
            <p className={cardStyles["product-category"]}>{category}</p>
            <h6 className={cardStyles["product-name"]}>{productName}</h6>
          </div>
          <p className={cardStyles["product-price"]}>PKR {price.toFixed(2)}</p>
          <button
            className={cardStyles["btn-add-cart"]}
            onClick={() => addToCart(id)}
          >
            <FontAwesomeIcon
              className={cardStyles["fa-solid fa-cart-shopping"]}
              icon={faCartShopping}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
