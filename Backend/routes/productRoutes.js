// external libraries
import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import { getProducts, getTopRatedProducts, getProductById, createProduct, createProductReview, deleteProduct } from '../controller/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

// route to get all products
router.route('/').get(asyncHandler(getProducts)).post(protect, admin, createProduct);
router.route('/top-rated').get(asyncHandler(getTopRatedProducts));
router.route('/:id').get(asyncHandler(getProductById)).delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, asyncHandler(createProductReview));

export default router;