import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import productReducer from './productSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        auth: authReducer,
        products: productReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;