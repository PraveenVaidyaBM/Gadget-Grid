import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../slices/authSlice";
import { useLogoutMutation } from "../slices/userSlice";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  return useCallback(async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || error.error || "Unable to sign out.");
    }
  }, [dispatch, logoutApiCall, navigate]);
};

export default useLogout;
