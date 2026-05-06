

import type { Product } from "../../types/products.types";

import Card from "../../components/card/card";
const relatedproducts = ({items}: {items: Product[]}) => {
  return (
    <section className="related-products py-5 bg-white">
      <div className="container">
        <div className="row">
          <div className="col-12 d-flex align-items-center justify-content-center mb-4">
            <h2 className="section-title">You May Also Like</h2>
          </div>
          <div className="col-12 row g-4">
            {items.map((item) => (
              <Card
              multiplyCard={2}
                key={item.id}
                id={item.id}
                productName={item.name}
                category={item.category}
                price={Number(item.price)}
                imageSrc={item.image}
                page="home"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default relatedproducts;
