export interface Product {
  id: number;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  image: string;
  discription: string; // لاحظت أنك كاتبها discription في الداتا
}
export interface Category {
  id: number;
  name: string;
  discription: string;
}