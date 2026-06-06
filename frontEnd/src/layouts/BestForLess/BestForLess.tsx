import React, { useState, useEffect } from "react";
import Card from "../../components/card/card";
import api from "../../api/api";
import { AllProducts } from "../../api/data";
import "./BestForLess.css";

const BestForLess: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestProducts = async () => {
      try {
        const res = await api.get("/products", { params: { isBestForLess: true } });
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(AllProducts.filter(p => p.isBestForLess));
        }
      } catch (err) {
        console.error("Failed to fetch best products, using fallback", err);
        setProducts(AllProducts.filter(p => p.isBestForLess));
      } finally {
        setLoading(false);
      }
    };
    fetchBestProducts();
  }, []);

  return (
    <section className="best-for-less py-5 bg-white">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="section-title">The Best For Less</h2>
            <p className="text-muted mb-0">Popular in your city</p>
          </div>
          <div>
            <a href="#" className="btn btn-view-all btn-view-all-large">
              View All
            </a>
          </div>
        </div>

        <div className="row g-4">
          {loading ? (
            <div className="col-12 text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            products.map((product) => (
              <Card
                key={product.id || product._id}
                id={product.id}
                productName={product.name}
                imageSrc={product.image}
                price={product.price}
                category={product.category}
                page="home"
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default BestForLess;