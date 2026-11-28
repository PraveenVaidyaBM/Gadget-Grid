import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import { STRONG_PASSWORD_PATTERN } from "../utils/constant.js";
import {
  generateToken,
} from "../utils/generateToken.js.js";

// @desc    Auth User
// @route   POST /api/user/login
// @access  Public

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.isValidPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// @desc    Register User
// @route   POST /api/user
// @access  Public

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (
    typeof password !== "string" ||
    !STRONG_PASSWORD_PATTERN.test(password)
  ) {
    res.status(400);
    throw new Error(
      "Password must be at least 8 characters and include uppercase and lowercase letters, a number, and a special character.",
    );
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("invalid user details");
  }
});

// @desc    Logout and Clear cookie
// @route   POST /api/user/logout
// @access  Private

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  });
  res.status(200).json({ message: "looged out successfully" });
});

// @desc    Get User Profile
// @route   GET /api/user/profile
// @access  Private

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

// @desc    Update User Profile
// @route   PUT /api/user/profile
// @access  Private

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else{
     res.status(404);
    throw new Error("user not found");
  }
});

// @desc    Get Users
// @route   GET /api/users
// @access  Private/Admin

export const getUsers = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;;
  const requestedPage = Number.parseInt(req.query.pageNumber, 10);
  const pageNumber = Number.isInteger(requestedPage)
    ? Math.max(requestedPage, 1)
    : 1;
  const count = await User.countDocuments({});
  const users = await User.find({})
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (pageNumber - 1));

  res.json({
    users,
    pageNumber,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Get User By ID
// @route   GET /api/users/:id
// @access  Private/Admin

export const getUsersById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  res.json(user);
});

// @desc    Delete User
// @route   DELETE /api/users/:id
// @access  Private/Admin

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }
  if (user.isAdmin) {
    res.status(400);
    throw new Error("Administrator accounts cannot be deleted.");
  }
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot delete your own account.");
  }

  await user.deleteOne();
  res.json({ message: "User removed." });
});

// @desc    Update User
// @route   PUT /api/users/:id
// @access  Private/Admin

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const email =
    typeof req.body.email === "string" ? req.body.email.trim() : "";
  if (!name || !email) {
    res.status(400);
    throw new Error("Name and email are required.");
  }
  if (typeof req.body.isAdmin !== "boolean") {
    res.status(400);
    throw new Error("Administrator status must be true or false.");
  }

  const existingUser = await User.findOne({
    email,
    _id: { $ne: user._id },
  });
  if (existingUser) {
    res.status(400);
    throw new Error("Email is already in use.");
  }

  if (req.body.password !== undefined && req.body.password !== "") {
    if (
      typeof req.body.password !== "string" ||
      !STRONG_PASSWORD_PATTERN.test(req.body.password)
    ) {
      res.status(400);
      throw new Error(
        "Password must be at least 8 characters and include uppercase and lowercase letters, a number, and a special character.",
      );
    }
    user.password = req.body.password;
  }

  user.name = name;
  user.email = email;
  user.isAdmin = req.body.isAdmin;
  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});
