import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { RootState } from "../../store/store";
import { removeFromCart, updateQuantity, clearCart, selectCartTotal } from "../../store/cartSlice";
import { AllProducts } from "../../api/data";
import RelatedProducts from "../../layouts/relatedProducts/relatedproducts";
import api from "../../api/api";
import styles from "./Cart.module.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 1. Get cart summaries from Redux
  const cartSummary = useSelector((state: RootState) => state.cart.items);
  const totalPrice = useSelector(selectCartTotal);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Checkout Form States
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    city: "Cairo",
    phone: ""
  });

  // Settings / Delivery Fee State
  const [deliveryFee, setDeliveryFee] = useState(25);

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  // Fetch delivery fee from settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        if (res.data && res.data.deliveryFee !== undefined) {
          setDeliveryFee(res.data.deliveryFee);
        }
      } catch (err) {
        console.error("Failed to fetch settings, using default delivery fee.", err);
      }
    };
    fetchSettings();
  }, []);

  // 2. Hydrate item details
  const cartItems = cartSummary.map((item) => {
    if (item.name && item.price !== undefined && item.image) {
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category || "",
        qty: item.qty
      };
    }
    const fullProduct = AllProducts.find((p) => p.id === item.id);
    return fullProduct ? { ...fullProduct, qty: item.qty } : null;
  }).filter(Boolean);

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed to checkout.");
      navigate("/login");
      return;
    }
    setIsCheckingOut(true);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "MED20") {
      setIsCouponApplied(true);
      toast.success("Coupon MED20 applied successfully! 20% discount added.");
    } else {
      toast.error("Invalid coupon code.");
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Basic empty check
    if (!shippingDetails.fullName || !shippingDetails.address || !shippingDetails.phone) {
      toast.error("Please fill in all shipping details.");
      return;
    }

    // 2. Full Name validation (Arabic & English letters and spaces only)
    const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]+$/;
    if (!nameRegex.test(shippingDetails.fullName)) {
      toast.error("Please enter a valid full name (letters and spaces only).");
      return;
    }

    // 3. Phone Number validation (Egyptian mobile number: 11 digits starting with 010, 011, 012, or 015)
    const phoneRegex = /^01[0125][0-9]{8}$/;
    if (!phoneRegex.test(shippingDetails.phone)) {
      toast.error("Please enter a valid Egyptian phone number (11 digits starting with 010, 011, 012, or 015).");
      return;
    }

    // 4. Address validation (minimum 10 characters, can't be just numbers)
    if (shippingDetails.address.length < 10) {
      toast.error("Please enter a more detailed delivery address (minimum 10 characters).");
      return;
    }
    if (/^\d+$/.test(shippingDetails.address)) {
      toast.error("Address cannot consist of only numbers.");
      return;
    }

    // 5. City mismatch check
    const selectedCity = shippingDetails.city.toLowerCase();
    const addressText = shippingDetails.address.toLowerCase();
    const citiesList = ["cairo", "alexandria", "giza", "mansoura"];
    const conflictingCities = citiesList.filter(c => c !== selectedCity);
    
    for (const city of conflictingCities) {
      // Using word boundary or simple check to avoid matching substrings (like 'cairos' or similar)
      const wordMatchRegex = new RegExp(`\\b${city}\\b`);
      if (wordMatchRegex.test(addressText) || addressText.includes(city)) {
        toast.error(`Conflicting address: You selected "${shippingDetails.city}" but your address text contains "${city}". Please correct it.`);
        return;
      }
    }

    setIsSubmittingOrder(true);
    try {
      const itemsPayload = cartItems.map(item => ({
        product: item!.id, // backend maps numeric id to ObjectId automatically
        qty: item!.qty,
        price: item!.price
      }));

      await api.post("/orders", {
        items: itemsPayload,
        shippingAddress: shippingDetails,
        totalAmount: finalTotal,
        prescriptionImage: ""
      });

      toast.success("Order placed successfully!");
      dispatch(clearCart());
      setIsCheckingOut(false);
      navigate("/home");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Calculations
  const appliedDiscount = isCouponApplied ? totalPrice * 0.20 : 0;
  const finalTotal = cartItems.length > 0 ? totalPrice - appliedDiscount + deliveryFee : 0;

  return (
    <>
      <section className={styles.cardContent}>
        <div className="container">
          <div className="row">
            {/* Main Content Area: Items list or Checkout Form */}
            <div className="col-lg-8">
              {isCheckingOut ? (
                <div className={`${styles.cardItems} card mb-3 p-4`}>
                  <h4 className="fw-bold mb-4 text-dark-blue">Shipping &amp; Delivery Details</h4>
                  <form onSubmit={handlePlaceOrder}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">FULL NAME</label>
                      <input 
                        type="text" 
                        className="form-control py-2.5 rounded-3" 
                        required 
                        placeholder="Enter your full name"
                        value={shippingDetails.fullName}
                        onChange={e => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                        disabled={isSubmittingOrder}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">PHONE NUMBER</label>
                      <input 
                        type="tel" 
                        className="form-control py-2.5 rounded-3" 
                        required 
                        placeholder="e.g. 01012345678"
                        value={shippingDetails.phone}
                        onChange={e => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                        disabled={isSubmittingOrder}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">DELIVERY ADDRESS</label>
                      <input 
                        type="text" 
                        className="form-control py-2.5 rounded-3" 
                        required 
                        placeholder="Street name, Building no, Apartment no"
                        value={shippingDetails.address}
                        onChange={e => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                        disabled={isSubmittingOrder}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-muted">CITY</label>
                      <select 
                        className="form-select py-2.5 rounded-3" 
                        value={shippingDetails.city}
                        onChange={e => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                        disabled={isSubmittingOrder}
                      >
                        <option value="Cairo">Cairo</option>
                        <option value="Alexandria">Alexandria</option>
                        <option value="Giza">Giza</option>
                        <option value="Mansoura">Mansoura</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="d-flex gap-2 mt-4">
                      <button type="submit" className="btn btn-primary px-4 py-2.5 rounded-pill text-white fw-bold" disabled={isSubmittingOrder}>
                        {isSubmittingOrder ? "Placing Order..." : "Confirm & Place Order"}
                      </button>
                      <button type="button" className="btn btn-outline-secondary px-4 py-2.5 rounded-pill" onClick={() => setIsCheckingOut(false)} disabled={isSubmittingOrder}>
                        Back to Cart
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
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
                            <span>EGP {(item!.price * item!.qty).toFixed(2)}</span>
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
                      <Link to="/products" className="btn btn-primary mt-3 text-white rounded-pill px-4">Shop Now</Link>
                    </div>
                  )}

                  <div className={`d-flex justify-content-between ${styles.cardButtons} mt-3`}>
                    <Link to="/products" className={`btn ${styles.backBtn}`}>← Back to shop</Link>
                    <button 
                      className={`btn ${styles.removeBtn}`} 
                      onClick={() => dispatch(clearCart())}
                      disabled={cartItems.length === 0}
                    >
                      Remove all
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary panel */}
            <div className={`col-lg-4 ${styles.orderSummary}`}>
              <div className={`${styles.priceDetails} border rounded p-3 bg-white shadow-sm`}>
                <div className="d-flex justify-content-between mb-2">
                  <span className={styles.type}>Subtotal:</span>
                  <span className={styles.amount}>EGP {totalPrice.toFixed(2)}</span>
                </div>
                {isCouponApplied && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span className={styles.type}>Discount (20%):</span>
                    <span className={styles.amount}>- EGP {appliedDiscount.toFixed(2)}</span>
                  </div>
                )}
                {cartItems.length > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className={styles.type}>Delivery Fee:</span>
                    <span className={styles.amount}>+ EGP {deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-2">
                  <span className={styles.type}>Tax:</span>
                  <span className="text-success">+ EGP 0.00</span>
                </div>
                <hr />
                <div className={`${styles.totalAmount} d-flex justify-content-between fw-bold fs-5`}>
                  <span className={styles.total}>Total:</span>
                  <span className={styles.amount}>EGP {finalTotal.toFixed(2)}</span>
                </div>

                {/* Coupon Code Input */}
                {cartItems.length > 0 && (
                  <div className="mt-3 border-top pt-3">
                    <form onSubmit={handleApplyCoupon} className="d-flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Promo code (e.g. MED20)" 
                        className="form-control form-control-sm rounded-pill px-3"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={isCouponApplied}
                      />
                      <button 
                        type="submit" 
                        className="btn btn-sm btn-outline-primary rounded-pill px-3 text-nowrap"
                        disabled={isCouponApplied || !couponCode.trim()}
                      >
                        Apply
                      </button>
                    </form>
                    {isCouponApplied && (
                      <div className="d-flex justify-content-between mt-2 align-items-center">
                        <span className="text-success small fw-semibold">Coupon MED20 Active</span>
                        <button 
                          type="button" 
                          className="btn btn-link btn-sm text-danger p-0 text-decoration-none"
                          onClick={() => {
                            setIsCouponApplied(false);
                            setCouponCode("");
                            toast.info("Coupon removed.");
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {!isCheckingOut && (
                  <button 
                    className="btn btn-primary w-100 mt-3 py-2.5 rounded-pill text-white fw-bold" 
                    disabled={cartItems.length === 0}
                    onClick={handleCheckoutClick}
                  >
                    Checkout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <RelatedProducts items={AllProducts.slice(0, 6)} />
    </>
  );
};

export default Cart;
