import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { clearCart } from "../slices/cartSlice";
import { useCreateOrderMutation } from "../slices/oderAPiSlice";

export const usePlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod, cartItems } = cart;

  const placeOrderHandler = async () => {
    try {
      const order = {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      };
      const res = await createOrder(order).unwrap();
      dispatch(clearCart());
      navigate(`/order/${res._id}`);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to place order");
    }
  };

  return { placeOrderHandler, isLoading, error };
};
