import jwt from "jsonwebtoken";

const jwtCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  sameSite: "strict",
  path: "/",
};

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    ...jwtCookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
  });
};