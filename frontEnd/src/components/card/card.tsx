import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { addToCart } from "../../store/cartSlice";
import cardStyles from "./card.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface CardProps {
  page?: "home" | "product";
  id: number;
  productName: string;
  imageSrc: string;
  price: number;
  category: string;
  multiplyCard?: number;
}

const Card = ({
  productName,
  imageSrc,
  price,
  category,
  page,
  id,
  multiplyCard = 3, // القيمة الافتراضية 3 إذا لم يتم تمرير شيء
}: CardProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({ 
      id, 
      qty: 1,
      name: productName,
      price: price,
      image: imageSrc,
      category: category
    }));
    toast.success("Product added to cart!");
  };
  const navigateToProduct = (id: number) => {
    navigate(`/product/${id}`);
     window.scrollTo({
    top: 0,
    behavior: "smooth" 
  });
    
  };
  return (
    <div
      role="button"
      className={`col-12 col-sm-12 col-md-6 col-lg-${multiplyCard}`}
    >
      <div
        className={
          page === "home" ? cardStyles["home-card"] : cardStyles["product-card"]
        }
      >
        <div
          className={cardStyles["product-image"]}
          onClick={() => navigateToProduct(id)}
        >
          <img src={imageSrc} alt={productName} />
        </div>

        <div
          className={`${cardStyles["product-info"]} d-flex flex-column justify-content-between`}
        >
          <div>
            <p className={cardStyles["product-category"]}>{category}</p>
            <h6 className={cardStyles["product-name"]}>{productName}</h6>
          </div>

          <p className={cardStyles["product-price"]}>EGP {price.toFixed(2)}</p>

          <button
            className={cardStyles["btn-add-cart"]}
            onClick={(e) => {
              addToCartHandler(e);
            }}
          >
            <FontAwesomeIcon icon={faCartShopping} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
