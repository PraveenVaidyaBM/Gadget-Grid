// external libraries
import express from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import {
  getProducts,
  getTopRatedProducts,
  getProductById,
  createProduct,
  updateProduct,
  createProductReview,
  deleteProduct,
} from '../controller/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadProductImage } from '../middleware/productImageUpload.js';
const router = express.Router();

// route to get all products
router
  .route('/')
  .get(asyncHandler(getProducts))
  .post(protect, admin, uploadProductImage, createProduct);
router.route('/top-rated').get(asyncHandler(getTopRatedProducts));
router
  .route('/:id')
  .get(asyncHandler(getProductById))
  .put(protect, admin, uploadProductImage, updateProduct)
  .delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, asyncHandler(createProductReview));

export default router;