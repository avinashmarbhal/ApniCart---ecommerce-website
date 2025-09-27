import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/user/userSlice";
import addressReducer from "../features/address/addressSlice";
import cartReducer from "../features/cart/cartSlice"
import  categoryReducer from  "../features/category-subcategory/categorySlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    address: addressReducer,
    category: categoryReducer
  },
  
  devTools: false //disables Redux DevTools
});
