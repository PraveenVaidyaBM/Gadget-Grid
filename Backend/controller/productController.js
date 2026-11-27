import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
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
  const { name, description, brand, category, price, countInStock } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

  if (
    ![name, imagePath, description, category].every(
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
    image: imagePath.trim(),
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

// @desc    Update Product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  const name =
    typeof req.body.name === "string" ? req.body.name.trim() : product.name;
  const image = req.file?.filename
    ? `/uploads/${req.file.filename}`
    : product.image;
  const description =
    typeof req.body.description === "string"
      ? req.body.description.trim()
      : product.description;
  const category =
    typeof req.body.category === "string"
      ? req.body.category.trim()
      : product.category;

  if (![name, image, description, category].every((value) => value.trim())) {
    res.status(400);
    throw new Error("Name, image, description, and category are required.");
  }

  const numericPrice =
    req.body.price === undefined ? product.price : Number(req.body.price);
  const numericStock =
    req.body.countInStock === undefined
      ? product.countInStock
      : Number(req.body.countInStock);
  if (
    req.body.price === "" ||
    !Number.isFinite(numericPrice) ||
    numericPrice < 0 ||
    req.body.countInStock === "" ||
    !Number.isInteger(numericStock) ||
    numericStock < 0
  ) {
    res.status(400);
    throw new Error("Price and stock must be valid non-negative numbers.");
  }

  product.name = name;
  product.image = image;
  product.description = description;
  product.brand =
    typeof req.body.brand === "string" ? req.body.brand.trim() : product.brand;
  product.category = category;
  product.price = numericPrice;
  product.countInStock = numericStock;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete Product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  await product.deleteOne();
  res.status(200).json({ message: "Product removed." });
});