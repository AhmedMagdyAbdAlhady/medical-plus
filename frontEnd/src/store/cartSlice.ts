import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AllProducts } from '../api/data';
import type { RootState } from './store'; // تأكد من أن المسار يؤدي لملف الـ store الخاص بك

interface CartItemSummary {
  id: number;
  qty: number;
  name?: string;
  price?: number;
  image?: string;
  category?: string;
}

interface CartState {
  items: CartItemSummary[];
}

const getCurrentCartKey = (): string => {
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return 'cart:guest';

    const user = JSON.parse(storedUser);
    const userKey = user?._id || user?.email;
    return userKey ? `cart:${userKey}` : 'cart:guest';
  } catch {
    return 'cart:guest';
  }
};

// تحميل البيانات من LocalStorage عند البداية لضمان بقاء السلة بعد التحديث
const loadCartFromStorage = (): CartItemSummary[] => {
  try {
    const saved = localStorage.getItem(getCurrentCartKey());
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItemSummary[]) => {
  localStorage.setItem(getCurrentCartKey(), JSON.stringify(items));
  localStorage.removeItem('cart');
};

const initialState: CartState = {
  items: loadCartFromStorage(),
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
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; qty: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.qty = action.payload.qty;
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem(getCurrentCartKey());
      localStorage.removeItem('cart');
    },
    loadCartForCurrentUser: (state) => {
      state.items = loadCartFromStorage();
    },
  },
});

// --- Selectors ---

// 1. حساب السعر الإجمالي (Total Price)
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => {
    const price = item.price !== undefined ? item.price : (AllProducts.find(p => p.id === item.id)?.price || 0);
    return total + (price * item.qty);
  }, 0);

// 2. حساب عدد العناصر الكلي (Total Quantity) - مفيد لأيقونة الـ Navbar
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((count, item) => count + item.qty, 0);

// 3. جلب ملخص السلة
export const selectCartItems = (state: RootState) => state.cart.items;

export const { addToCart, removeFromCart, updateQuantity, clearCart, loadCartForCurrentUser } = cartSlice.actions;
export default cartSlice.reducer;
