import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../slices/cartSlice";

const useProductDetails = (product) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const addToCartHandler = useCallback(() => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  }, [dispatch, navigate, product, qty]);

  return { qty, setQty, addToCartHandler };
};

export default useProductDetails;
