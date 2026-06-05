import React from "react";
import Card from "../../components/card/card";
import style   from "./PopularProducts.module.css";
import"./PopularProducts.css";
// 2. تنظيم البيانات في كائنات (Objects) لسهولة الإدارة
const productsData = {
  supplements: [
    {
      id: 1,
      name: "Vitamin Complex 60 Tabs",
      category: "Supplements",
      price: 1250.00,
      image: "/images/product1.webp",
    },
    {
      id: 2,
      name: "Omega-3 1000mg",
      category: "Supplements",
      price:  890.00,
      image: "/images/product2.webp",
    },
     {
      id: 3,
      name: "Vitamin Complex 60 Tabs",
      category: "Supplements",
      price: 1250.00,
      image: "/images/product1.webp",
    },
    {
      id: 4,
      name: "Omega-3 1000mg",
      category: "Supplements",
      price:  890.00,
      image: "/images/product2.webp",
    },
  ],
  medicines: [
    {
      id: 7,
      name: "Panadol Extra 500mg",
      category: "Headache & Migraine",
      price: 30.00,
      image: "/images/product2.webp",
    },
    {
      id: 8,
      name: "Brufen 400mg Tablets",
      category: "Pain Relief",
      price:  45.00,
      image: "/images/product3.webp",
    },
     {
      id: 9,
      name: "Vitamin Complex 60 Tabs",
      category: "Supplements",
      price: 1250.00,
      image: "/images/product1.webp",
    },
    {
      id: 10,
      name: "Omega-3 1000mg",
      category: "Supplements",
      price:  890.00,
      image: "/images/product2.webp",
    },
  ],
  herbs: [
    {
      id: 13,
      name: "Pure Ashwagandha Powder",
      category: "Herbs",
      price:  450.00,
      image: "/images/product4.webp",
    },
     {
      id: 14,
      name: "Vitamin Complex 60 Tabs",
      category: "Supplements",
      price: 1250.00,
      image: "/images/product1.webp",
    },
    {
      id: 15,
      name: "Omega-3 1000mg",
      category: "Supplements",
      price:  890.00,
      image: "/images/product2.webp",
    },
  ],
};

const PopularProducts: React.FC = () => {
  // دالة مساعدة لرسم الكروت لمنع التكرار
  const renderProductCards = (categoryKey: keyof typeof productsData) => {
    return productsData[categoryKey].map((p) => (
      <Card key={p.id} page="home" id={p.id} productName={p.name} category={p.category} price={p.price} imageSrc={p.image} />
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
          <div className="tab-pane fade" id="supplements" role="tabpanel">
            <div className="row g-3">{renderProductCards("supplements")}</div>
          </div>
          <div
            className="tab-pane fade show active"
            id="medicines"
            role="tabpanel"
          >
            <div className="row g-3">{renderProductCards("medicines")}</div>
          </div>
          <div className="tab-pane fade" id="herbs" role="tabpanel">
            <div className="row g-3">{renderProductCards("herbs")}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
