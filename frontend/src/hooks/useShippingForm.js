import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { saveShippingAddress } from "../slices/cartSlice";
import useFormState from "./useFormState";

const useShippingForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shippingAddress = useSelector((state) => state.cart.shippingAddress);
  
  const { values, handleChange } = useFormState({
    address: shippingAddress?.address || "",
    city: shippingAddress?.city || "",
    postalCode: shippingAddress?.postalCode || "",
    country: shippingAddress?.country || "",
  });
  const isComplete = useMemo(
    () => Object.values(values).every((value) => value.trim().length > 0),
    [values],
  );

  const submitHandler = useCallback(
    (event) => {
      event.preventDefault();
      const shippingAddress = Object.fromEntries(
        Object.entries(values).map(([field, value]) => [field, value.trim()]),
      );
      if (Object.values(shippingAddress).some((value) => !value)) {
        toast.error("Please complete all shipping address fields.");
        return;
      }

      dispatch(saveShippingAddress(shippingAddress));
      navigate("/payment");
    },
    [dispatch, navigate, values],
  );

  return { values, handleChange, submitHandler, isComplete };
};

export default useShippingForm;
