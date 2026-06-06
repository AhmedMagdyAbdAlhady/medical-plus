export interface Product {
    id: number;
  name: string;
  brand: string;         
  category: string;
  subCategory: string;
  price: number;
  image: string;
  productRelated: number[]; 
  generics: string;      
  usedFor: string;       
  howItWorks: string;    
  precautions: string;   
  sideEffects: string;   
  description: string;
}
export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  subCategories: string[];
}