import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";

// Data and Types
import { AllProducts, Allcategory } from "../../api/data";
import type { Product } from "../../types/products.types";

import style from "./products.module.css";
// Components
import TitlePage from "../../layouts/TitlePage/TitlePage";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Card from "../../components/card/card";

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  // 1. States
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 2. Get active category data
  const activeCategory = useMemo(() => {
    if (!category) return null;
    return Allcategory.find((c) => c.name === category) || null;
  }, [category]);

  // Reset sub-categories when main category changes
  useEffect(() => {
    setSelectedSubs([]);
  }, [category]);

  // 3. Logic: Handle Sub-category Change
  const handleSubCategoryChange = (sub: string, catName: string) => {
    if (category !== catName) {
      navigate(`/Products/${catName}`);
      setSelectedSubs([sub]);
      return;
    }
    setSelectedSubs((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub],
    );
  };

  // 4. Logic: Filter and Sort Products
  const processedProducts = useMemo(() => {
    let result = [...AllProducts];

    // Filter by Main Category (URL)
    if (category) {
      result = result.filter((p) => p.category === category);
    }

    // Filter by Sub-categories (Sidebar)
    if (selectedSubs.length > 0) {
      result = result.filter((p) => selectedSubs.includes(p.subCategory));
    }

    // Search Filter
    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sorting Logic
    if (sortBy === "low-to-high") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "high-to-low") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [category, selectedSubs, sortBy, searchQuery]);

  // 5. Breadcrumbs Items
  const breadcrumbItems = useMemo(() => {
    const items = [{ label: "Products", href: "/Products" }];
    if (activeCategory) {
      items.push({
        label: activeCategory.name,
        href: `/Products/${activeCategory.name}`,
      });
    }
    return items;
  }, [activeCategory]);

  return (
    <div className="products">
      {/* Page Title Section (Matching HTML) */}
      <TitlePage title={category ? category : "Products"} />

      {/* Breadcrumb Section */}

      <div className="container  py-3 ">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="container mt-3 mb-5">
        <div className="row">
          {/* Sidebar - Filtering (Matching HTML Structure) */}
          <aside className="col-lg-3 col-md-4 mb-4">
            <div className="sidebar shadow-sm border rounded bg-white">
              <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                <h5 className="filter-title m-0 fw-bold">Categories</h5>
                {(category || selectedSubs.length > 0) && (
                  <button
                    className="btn btn-sm text-danger p-0 border-0 bg-transparent"
                    onClick={() => {
                      navigate("/Products");
                      setSelectedSubs([]);
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="accordion accordion-flush" id="categoryAccordion">
                {Allcategory.map((cat) => (
                  <div className="accordion-item" key={cat.id}>
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button shadow-none ${activeCategory?.id !== cat.id ? "collapsed" : ""}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${cat.id}`}
                      >
                        {cat.name}
                      </button>
                    </h2>
                    <div
                      id={`collapse-${cat.id}`}
                      className={`accordion-collapse collapse ${activeCategory?.id === cat.id ? "show" : ""}`}
                      data-bs-parent="#categoryAccordion"
                    >
                      <div className="accordion-body">
                        {cat.subCategories.map((sub) => (
                          <div className="form-check mb-2" key={sub}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`check-${sub}`}
                              checked={selectedSubs.includes(sub)}
                              onChange={() =>
                                handleSubCategoryChange(sub, cat.name)
                              }
                            />
                            <label
                              className="form-check-label w-100 small"
                              htmlFor={`check-${sub}`}
                              style={{ cursor: "pointer" }}
                            >
                              {sub}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-lg-9 col-md-8">
            {category && activeCategory && (
              // <!-- Category Description -->
            
                <p className={style.description}>
                  {activeCategory.description}
                </p>
            )}
            {/* Toolbar: Sorting & Count */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 p-3 border rounded bg-white shadow-sm">
              <div className="text-muted mb-2 mb-md-0">
                Showing <strong>{processedProducts.length}</strong> products
              </div>
              <div className="d-flex gap-2">
                <select
                  className="form-select form-select-sm shadow-none w-auto"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Default sorting</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="row g-4">
              {processedProducts.length > 0 ? (
                processedProducts.map((product) => (
                  <Card
                    key={product.id}
                    id={product.id}
                    productName={product.name}
                    category={product.category}
                    price={Number(product.price)}
                    imageSrc={product.image}
                  />
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <div className="p-5 border rounded bg-light">
                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4 className="text-muted">No products found.</h4>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
