// external libraries
import express from "express";
import {
  addNewOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from "../controller/oderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, admin, getOrders).post(protect, addNewOrder);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/delivered").put(protect, admin, updateOrderToDelivered);

export default router;
