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

// @desc    Get User
// @route   GET /api/user/profile
// @access  Private/Admin

export const getUsers = asyncHandler(async (req, res) => {
  res.send("Get all User");
});

// @desc    Get User By ID
// @route   GET /api/user/:id
// @access  Private/Admin

export const getUsersById = asyncHandler(async (req, res) => {
  res.send("Get User By Id");
});

// @desc    Delete User
// @route   DELETE /api/user/:id
// @access  Private/Admin

export const deleteUser = asyncHandler(async (req, res) => {
  res.send("Delete User");
});

// @desc    Update User
// @route   PUT /api/user/:id
// @access  Private/Admin

export const updateUser = asyncHandler(async (req, res) => {
  res.send("Update User");
});
