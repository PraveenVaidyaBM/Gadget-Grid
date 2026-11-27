import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/authSlice";
import { useLoginMutation } from "../slices/userSlice";
import useFormState from "./useFormState";

const useLoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get("redirect") || "/";
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { values, handleChange } = useFormState({email: "", password: ""});
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        const result = await login(values).unwrap();
        dispatch(setCredentials(result));
        navigate(redirect);
      } catch (error) {
        toast.error(error?.data?.message || error.error || "Sign-in failed.");
      }
    },
    [dispatch, login, navigate, redirect, values],
  );

  return { values, handleChange, submitHandler, isLoading, redirect };
};

export default useLoginForm;
