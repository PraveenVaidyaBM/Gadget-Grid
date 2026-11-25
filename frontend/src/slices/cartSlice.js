import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/function";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === item._id
            ? {
                ...item,
                qty: Math.min(x.qty + item.qty, item.countInStock),
              }
            : x,
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload,
      );
      updateCart(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      updateCart(state);
    }
  },
});

export const { addToCart, removeFromCart,clearCart, saveShippingAddress, savePaymentMethod } = cartSlice.actions;

export default cartSlice.reducer;
