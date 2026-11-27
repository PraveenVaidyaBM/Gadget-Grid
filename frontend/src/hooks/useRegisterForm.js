import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { INITIAL_FORM, STRONG_PASSWORD_PATTERN } from "../utils/constant";
import { setCredentials } from "../slices/authSlice";
import { useRegisterMutation } from "../slices/userSlice";
import useFormState from "./useFormState";

const useRegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get("redirect") || "/";
  const userInfo = useSelector((state) => state.auth.userInfo);
  
  const { values, handleChange } = useFormState(INITIAL_FORM);
  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = useCallback(
    async (event) => {
      event.preventDefault();
      if (!STRONG_PASSWORD_PATTERN.test(values.password)) {
        toast.error(
          "Password must be at least 8 characters and include uppercase and lowercase letters, a number, and a special character.",
        );
        return;
      }
      if (values.confirmPassword !== values.password) {
        toast.error("Password does not match");
        return;
      }

      try {
        const result = await register({
          name: values.name,
          email: values.email,
          password: values.password,
        }).unwrap();
        dispatch(setCredentials(result));
        navigate(redirect);
      } catch (error) {
        toast.error(error?.data?.message || error.error || "Sign-up failed.");
      }
    },
    [dispatch, navigate, redirect, register, values],
  );

  return { values, handleChange, submitHandler, isLoading, redirect };
};

export default useRegisterForm;
