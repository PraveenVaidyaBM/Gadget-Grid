import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const useCartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const itemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.qty, 0),
    [cartItems],
  );
  const subtotal = useMemo(
    () =>
      cartItems
        .reduce((total, item) => total + item.price * item.qty, 0)
        .toFixed(2),
    [cartItems],
  );

  const addToCartHandler = useCallback(
    (product, qty) => dispatch(addToCart({ ...product, qty })),
    [dispatch],
  );
  const removeFromCartHandler = useCallback(
    (productId) => dispatch(removeFromCart(productId)),
    [dispatch],
  );
  const checkoutHandler = useCallback(
    () => navigate("/login?redirect=/shipping"),
    [navigate],
  );

  return {
    cartItems,
    itemCount,
    subtotal,
    addToCartHandler,
    removeFromCartHandler,
    checkoutHandler,
  };
};

export default useCartPage;
