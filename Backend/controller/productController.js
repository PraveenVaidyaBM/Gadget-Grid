import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const pageNumber = Number(req.query.pageNumber) || 1;
  const keyword =
    typeof req.query.keyword === "string" ? req.query.keyword.trim() : "";
  const filter = keyword
    ? {
        name: {
          $regex: keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          $options: "i",
        },
      }
    : {};
  const count = await Product.countDocuments({ ...filter });
  const products = await Product.find({ ...filter })
    .limit(pageSize)
    .skip(pageSize * (pageNumber - 1));

  res.json({
    products,
    pageNumber,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Fetch top-rated products
// @route   GET /api/products/top-rated
// @access  Public
export const getTopRatedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .sort({ rating: -1, numReviews: -1 })
    .limit(5);

  res.json(products);
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

// @desc    Create Product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, image, description, brand, category, price, countInStock } =
    req.body;

  if (
    ![name, image, description, category].every(
      (value) => typeof value === "string" && value.trim(),
    )
  ) {
    res.status(400);
    throw new Error("Name, image, description, and category are required.");
  }

  const numericPrice = Number(price);
  const numericStock = Number(countInStock);
  if (
    price === "" ||
    price === undefined ||
    !Number.isFinite(numericPrice) ||
    numericPrice < 0 ||
    countInStock === "" ||
    countInStock === undefined ||
    !Number.isInteger(numericStock) ||
    numericStock < 0
  ) {
    res.status(400);
    throw new Error("Price and stock must be valid non-negative numbers.");
  }

  const product = await Product.create({
    user: req.user._id,
    name: name.trim(),
    image: image.trim(),
    description: description.trim(),
    brand: typeof brand === "string" ? brand.trim() : "",
    category: category.trim(),
    price: numericPrice,
    countInStock: numericStock,
    rating: 0,
    numReviews: 0,
  })

  res.status(201).json(product);
});