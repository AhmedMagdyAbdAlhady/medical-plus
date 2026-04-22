import Card from "../../components/card/card";
import "./BestForLess.css";
// تعريف النوع ليتطابق مع ما يحتاجه الـ Card
interface ProductItem {
  id: number;
  productName: string;
  imageSrc: string;
  price: number;
  category: string;
}

const bestProductsData: ProductItem[] = [
  { id: 1, productName: "Betadine Mouthwash And Gargle 250 Ml", category: "Sore Throat, Mouthwash/Gargle", price: 49.60, imageSrc: "/images/product1.webp" },
  { id: 2, productName: "Mucosolvan 30mg / 5ml Syrup 100 Ml", category: "Cough Remedies", price: 22.50, imageSrc: "/images/product2.webp" },
  { id: 3, productName: "Panadol Migraine Tablets 24's", category: "Headache & Migraine", price: 29.50, imageSrc: "/images/product3.webp" },
  { id: 4, productName: "Zyrtec 1mg/ML Oral Sol 75ml", category: "Allergy", price: 17.50, imageSrc: "/images/product4.webp" },
  // تكرار البيانات لملء الصفوف كما في التصميم
  { id: 5, productName: "Betadine Mouthwash And Gargle 250 Ml", category: "Sore Throat, Mouthwash/Gargle", price: 49.60, imageSrc: "/images/product1.webp" },
  { id: 6, productName: "Mucosolvan 30mg / 5ml Syrup 100 Ml", category: "Cough Remedies", price: 22.50, imageSrc: "/images/product2.webp" },
  { id: 7, productName: "Panadol Migraine Tablets 24's", category: "Headache & Migraine", price: 29.50, imageSrc: "/images/product3.webp" },
  { id: 8, productName: "Zyrtec 1mg/ML Oral Sol 75ml", category: "Allergy", price: 17.50, imageSrc: "/images/product4.webp" },
  { id: 9, productName: "Betadine Mouthwash And Gargle 250 Ml", category: "Sore Throat, Mouthwash/Gargle", price: 49.60, imageSrc: "/images/product1.webp" },
  { id: 10, productName: "Mucosolvan 30mg / 5ml Syrup 100 Ml", category: "Cough Remedies", price: 22.50, imageSrc: "/images/product2.webp" },
  { id: 11, productName: "Panadol Migraine Tablets 24's", category: "Headache & Migraine", price: 29.50, imageSrc: "/images/product3.webp" },
  { id: 12, productName: "Zyrtec 1mg/ML Oral Sol 75ml", category: "Allergy", price: 17.50, imageSrc: "/images/product4.webp" },
];

const BestForLess: React.FC = () => {
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
          {bestProductsData.map((product) => (
            <Card
              key={product.id}
              id={product.id}
              productName={product.productName}
              imageSrc={product.imageSrc}
              price={product.price}
              category={product.category}
              page="home"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestForLess;