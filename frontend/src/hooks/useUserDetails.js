import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../slices/userSlice";
import { setCredentials } from "../slices/authSlice";
import { EMPTY_USER_FORM, STRONG_PASSWORD_PATTERN } from "../utils/constant";

const getErrorMessage = (error, fallback) =>
  error?.data?.message || error?.error || fallback;

const useUserDetails = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [
    updateUser,
    { isLoading: isUpdating, error: updateError, reset: resetUpdate },
  ] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ ...EMPTY_USER_FORM });
  const isSaving = isUpdating;

  const openEditUserModal = useCallback(
    (user) => {
      resetUpdate();
      setEditingUser(user);
      setUserForm({
        name: user.name,
        email: user.email,
        password: "",
        confirmPassword: "",
        isAdmin: user.isAdmin,
      });
      setShowUserModal(true);
    },
    [resetUpdate],
  );

  const closeUserModal = useCallback(() => {
    if (!isSaving) {
      setShowUserModal(false);
      setEditingUser(null);
    }
  }, [isSaving]);

  const handleUserFormChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    setUserForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const saveUser = useCallback(
    async (event) => {
      event.preventDefault();

      if (userForm.password && !STRONG_PASSWORD_PATTERN.test(userForm.password)) {
        toast.error(
          "Password must be at least 8 characters and include uppercase and lowercase letters, a number, and a special character.",
        );
        return;
      }
      if (userForm.password !== userForm.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      const userData = {
        name: userForm.name.trim(),
        email: userForm.email.trim(),
        isAdmin: userForm.isAdmin,
      };
      if (userForm.password) {
        userData.password = userForm.password;
      }

      try {
        const updatedUser = await updateUser({
          id: editingUser._id,
          ...userData,
        }).unwrap();
        if (userInfo?._id === updatedUser._id) {
          dispatch(setCredentials(updatedUser));
        }
      } catch (error) {
        toast.error(getErrorMessage(error, "Could not update user."));
        return;
      }

      setShowUserModal(false);
      setEditingUser(null);
      setUserForm({ ...EMPTY_USER_FORM });
      toast.success("User updated successfully.");
    },
    [dispatch, editingUser, updateUser, userForm, userInfo?._id],
  );

  const deleteUserHandler = useCallback(
    async (user) => {
      if (!window.confirm(`Delete user "${user.name}"? This cannot be undone.`)) {
        return;
      }

      try {
        await deleteUser(user._id).unwrap();
        toast.success("User deleted successfully.");
      } catch (error) {
        toast.error(getErrorMessage(error, "Could not delete user."));
      }
    },
    [deleteUser],
  );

  return {
    editingUser,
    userForm,
    showUserModal,
    isSaving,
    isDeleting,
    formErrorMessage: updateError
      ? getErrorMessage(updateError, "Could not update user.")
      : "",
    openEditUserModal,
    closeUserModal,
    handleUserFormChange,
    saveUser,
    deleteUserHandler,
  };
};

export default useUserDetails;
