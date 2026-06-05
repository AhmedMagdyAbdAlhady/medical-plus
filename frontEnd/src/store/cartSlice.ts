import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AllProducts } from '../api/data';
import type { RootState } from './store'; // تأكد من أن المسار يؤدي لملف الـ store الخاص بك

interface CartItemSummary {
  id: number;
  qty: number;
}

interface CartState {
  items: CartItemSummary[];
}

// تحميل البيانات من LocalStorage عند البداية لضمان بقاء السلة بعد التحديث
const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItemSummary>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.qty += action.payload.qty;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; qty: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.qty = action.payload.qty;
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },
  },
});

// --- Selectors ---

// 1. حساب السعر الإجمالي (Total Price)
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => {
    const product = AllProducts.find(p => p.id === item.id);
    return total + (product ? product.price * item.qty : 0);
  }, 0);

// 2. حساب عدد العناصر الكلي (Total Quantity) - مفيد لأيقونة الـ Navbar
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((count, item) => count + item.qty, 0);

// 3. جلب ملخص السلة
export const selectCartItems = (state: RootState) => state.cart.items;

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
