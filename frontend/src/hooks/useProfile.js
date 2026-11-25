import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { setCredentials } from "../slices/authSlice";
import { useProfileMutation } from "../slices/usersApiSlice";
import { INITIAL_FORM, STRONG_PASSWORD_PATTERN } from "../utils/constant";
import useFormState from "./useFormState";

const useProfile = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { values, handleChange, reset } = useFormState({
    ...INITIAL_FORM,
    name: userInfo?.name || "",
    email: userInfo?.email || "",
  });
  const [updateProfile, { isLoading }] = useProfileMutation();

  useEffect(() => {
    reset({
      ...INITIAL_FORM,
      name: userInfo?.name || "",
      email: userInfo?.email || "",
    });
  }, [reset, userInfo?.email, userInfo?.name]);

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();

      const name = values.name.trim();
      const email = values.email.trim();

      if (!name || !email) {
        toast.error("Name and email are required.");
        return;
      }

      const { password, confirmPassword } = values;
      if (password || confirmPassword) {
        if (!password || !confirmPassword) {
          toast.error("Enter and confirm your new password.");
          return;
        }

        if (!STRONG_PASSWORD_PATTERN.test(password)) {
          toast.error(
            "Password must be at least 8 characters and include uppercase and lowercase letters, a number, and a special character.",
          );
          return;
        }

        if (password !== confirmPassword) {
          toast.error("Password does not match.");
          return;
        }
      }

      const profile = {
        name,
        email,
      };

      if (password) {
        profile.password = password;
      }

      try {
        const result = await updateProfile(profile).unwrap();
        dispatch(setCredentials(result));
        reset({
          ...INITIAL_FORM,
          name: result.name,
          email: result.email,
        });
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(
          error?.data?.message || error?.error || "Profile update failed.",
        );
      }
    },
    [dispatch, reset, updateProfile, values],
  );

  return { values, handleChange, submitHandler, isLoading };
};

export default useProfile;
