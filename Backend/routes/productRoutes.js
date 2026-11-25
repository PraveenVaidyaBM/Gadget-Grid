// external libraries
import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import { getProducts, getProductById,createProductReview } from '../controller/productController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

// route to get all products
router.route('/').get(asyncHandler(getProducts));
router.route('/:id').get(asyncHandler(getProductById));
router.route('/:id/reviews').post(protect, asyncHandler(createProductReview));

export default router;