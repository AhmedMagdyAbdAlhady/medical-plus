import React, { useState, useEffect } from "react";
import Card from "../../components/card/card";
import api from "../../api/api";
import { AllProducts } from "../../api/data";
import style from "./PopularProducts.module.css";
import "./PopularProducts.css";

const PopularProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const res = await api.get("/products", { params: { isPopular: true } });
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(AllProducts.filter(p => p.isPopular));
        }
      } catch (err) {
        console.error("Failed to fetch popular products, using fallback", err);
        setProducts(AllProducts.filter(p => p.isPopular));
      } finally {
        setLoading(false);
      }
    };
    fetchPopularProducts();
  }, []);

  // Filter products dynamically
  const supplements = products.filter(p => 
    p.category === "Nutrition Supplements" || 
    p.category === "Sports Nutrition" || 
    p.subCategory === "Supplements" || 
    p.subCategory === "Vitamins"
  );

  const medicines = products.filter(p => 
    p.category === "Medicines" || 
    p.category === "Personal Care" || 
    p.subCategory === "Pain Relief" || 
    p.subCategory === "Cold Relief" || 
    p.subCategory === "Antibiotics"
  );

  const herbs = products.filter(p => 
    p.category === "Herbs" || 
    p.subCategory === "Herbal Supplements"
  );

  const renderProductCards = (list: any[]) => {
    if (list.length === 0) {
      return (
        <div className="col-12 text-center py-4 text-muted">
          No products in this category.
        </div>
      );
    }
    return list.map((p) => (
      <Card 
        key={p.id || p._id} 
        page="home" 
        id={p.id} 
        productName={p.name} 
        category={p.category} 
        price={p.price} 
        imageSrc={p.image} 
      />
    ));
  };

  return (
    <section className={`${style.popularProducts} py-5 bg-white`}>
      <div className="container">
        <h2 className={`text-center ${style.popularHeading} mb-4`}>Popular Categories</h2>
    
        {/* Tabs Navigation */}
        <ul
          className={`${style.customNavPills} nav nav-pills justify-content-center mb-4`}
          id="popularTabs"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${style.customNavLink}`}
              id="supplements-tab"
              data-bs-toggle="tab"
              data-bs-target="#supplements"
              type="button"
              role="tab"
            >
              Supplements
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${style.customNavLink} active`}
              id="medicines-tab"
              data-bs-toggle="tab"
              data-bs-target="#medicines"
              type="button"
              role="tab"
            >
              Medicines
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${style.customNavLink}`}
              id="herbs-tab"
              data-bs-toggle="tab"
              data-bs-target="#herbs"
              type="button"
              role="tab"
            >
              Herbs
            </button>
          </li>
        </ul>

        {/* Tabs Content */}
        <div className="tab-content" id="popularTabsContent">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading products...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="tab-pane fade" id="supplements" role="tabpanel">
                <div className="row g-3">{renderProductCards(supplements)}</div>
              </div>
              <div
                className="tab-pane fade show active"
                id="medicines"
                role="tabpanel"
              >
                <div className="row g-3">{renderProductCards(medicines)}</div>
              </div>
              <div className="tab-pane fade" id="herbs" role="tabpanel">
                <div className="row g-3">{renderProductCards(herbs)}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
