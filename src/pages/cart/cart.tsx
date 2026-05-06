import { useSelector, useDispatch } from "react-redux";
import type  {RootState}  from "../../store/store";
import { removeFromCart, updateQuantity, clearCart, selectCartTotal } from "../../store/cartSlice";
import { AllProducts } from "../../api/data";
import RelatedProducts from "../../layouts/relatedProducts/relatedproducts";
import styles from "./Cart.module.css";

const Cart = () => {
  const dispatch = useDispatch();
  
  // 1. جلب البيانات المبسطة من Redux
  const cartSummary = useSelector((state: RootState) => state.cart.items);
  const totalPrice = useSelector(selectCartTotal);

  // 2. دمج الـ IDs مع البيانات الكاملة (Hydration)
  const cartItems = cartSummary.map((item) => {
    const fullProduct = AllProducts.find((p) => p.id === item.id);
    return fullProduct ? { ...fullProduct, qty: item.qty } : null;
  }).filter(Boolean); // إزالة أي منتج غير موجود

  return (
    <>
      <section className={styles.cardContent}>
        <div className="container">
          <div className="row">
            {/* قائمة المنتجات */}
            <div className="col-lg-8">
              <div className={`${styles.cardItems} card mb-3`}>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item!.id} className={styles.cardItem}>
                      <div className="row align-items-center">
                        <div className="col-md-2 col-3">
                          <img src={item!.image} className="img-fluid" alt={item!.name} />
                        </div>
                        <div className="col-md-6 col-9">
                          <h6>{item!.name}</h6>
                          <div className={`d-flex gap-2 ${styles.buttons}`}>
                            <button 
                              className={`btn btn-sm ${styles.removeBtn}`}
                              onClick={() => dispatch(removeFromCart(item!.id))}
                            >
                              Remove
                            </button>
                            <button className={`btn btn-sm ${styles.saveBtn}`}>Save for later</button>
                          </div>
                        </div>
                        <div className={`col-md-4 ${styles.quantity}`}>
                          <span>Rs. {(item!.price * item!.qty).toFixed(2)}</span>
                          <select 
                            className="form-select mt-2"
                            value={item!.qty}
                            onChange={(e) => dispatch(updateQuantity({ id: item!.id, qty: Number(e.target.value) }))}
                          >
                            {[1, 2, 3, 4, 5].map(num => (
                              <option key={num} value={num}>Qty: {num}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-5">
                    <h4>Your cart is empty</h4>
                    <a href="/Products" className="btn btn-primary mt-3">Shop Now</a>
                  </div>
                )}

                <div className={`d-flex justify-content-between ${styles.cardButtons} mt-3`}>
                  <a href="/Products" className={`btn ${styles.backBtn}`}>← Back to shop</a>
                  <button 
                    className={`btn ${styles.removeBtn}`} 
                    onClick={() => dispatch(clearCart())}
                    disabled={cartItems.length === 0}
                  >
                    Remove all
                  </button>
                </div>
              </div>
            </div>

            {/* ملخص الطلب */}
            <div className={`col-lg-4 ${styles.orderSummary}`}>
              <div className={`${styles.priceDetails} border rounded p-3`}>
                <div className="d-flex justify-content-between mb-2">
                  <span className={styles.type}>Subtotal:</span>
                  <span className={styles.amount}>Rs. {totalPrice.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className={styles.type}>Tax:</span>
                  <span className="text-success">+ Rs. 0.00</span>
                </div>
                <hr />
                <div className={`${styles.totalAmount} d-flex justify-content-between fw-bold fs-5`}>
                  <span className={styles.total}>Total:</span>
                  <span className={styles.amount}>Rs. {totalPrice.toFixed(2)}</span>
                </div>
                <button className="btn btn-primary w-100 mt-3 py-2" disabled={cartItems.length === 0}>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* المنتجات ذات الصلة */}
      <RelatedProducts items={AllProducts.slice(0, 6)} />
    </>
  );
};

export default Cart;
