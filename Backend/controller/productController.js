import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const pageNumber = Number(req.query.pageNumber) || 1;
  const count = await Product.countDocuments();
  const products = await Product.find({}).limit(pageSize).skip(pageSize * (pageNumber - 1));

  res.json({
    products,
    pageNumber,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Fetch product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new Review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = await Product.findById(req.params.id);

  if (productId) {
    const alreadyReviewed = productId.reviews.find(
      (r) => r.user.toString() === req.user._id.toString(),
    );
    
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    productId.reviews.push(review);
    const numReviews = productId.reviews.length;
    productId.rating =
      productId.reviews.reduce((acc, review) => acc + review.rating, 0) /
      numReviews;
    await productId.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Unable to review product");
  }
});
