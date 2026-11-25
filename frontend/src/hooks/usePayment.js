import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../slices/cartSlice";

const usePayment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const paymentMethodChangeHandler = useCallback((event) => {
    setPaymentMethod(event.target.value);
  }, []);

  const submitHandler = useCallback((event) => {
    event.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  }, []);

  return {
    paymentMethod,
    paymentMethodChangeHandler,
    submitHandler,
  };
};

export default usePayment;
