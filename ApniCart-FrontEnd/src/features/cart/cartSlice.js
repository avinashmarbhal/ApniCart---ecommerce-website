// src/features/cart/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalItems: 0,
  totalMrpPrice: 0,
  totalDiscountedPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartData: (state, action) => {
      const { cartItems, totalItems, totalMrpPrice, totalDiscountedPrice } = action.payload;
      state.cartItems = cartItems;
      state.totalItems = totalItems;
      state.totalMrpPrice = totalMrpPrice;
      state.totalDiscountedPrice = totalDiscountedPrice;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalItems = 0;
      state.totalMrpPrice = 0;
      state.totalDiscountedPrice = 0;
    },
  },
});

export const { setCartData, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
