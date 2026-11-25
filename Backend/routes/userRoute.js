// external libraries
import express from "express";
import {
  authUser,
  registerUser,
  logout,
  getUserProfile,
  getUsers,
  getUsersById,
  updateUser,
  updateUserProfile,
  deleteUser,
} from "../controller/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, admin, getUsers).post(registerUser);
router.post("/logout", logout);
router.post("/login", authUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUsersById)
  .put(protect, admin, updateUser);

export default router;
