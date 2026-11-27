// external libraries
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

// config the environment variables
dotenv.config();
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import orderRoutes from "./routes/orderRoutes.js";
import { UPLOADS_DIRECTORY } from "./middleware/productImageUpload.js";

// define the port
const PORT = process.env.PORT || 5000;

// connect to database
connectDB();

// initialize the app
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
  );
}

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware

app.use(cookieParser());
app.use("/uploads", express.static(UPLOADS_DIRECTORY));

// define routes

// route for API health in development
if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// user route
app.use("/api/users", userRoutes);

// use product routes
app.use("/api/products", productRoutes);

// use order routes
app.use("/api/orders", orderRoutes);

// use paypal routes
app.use("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID }),
);

if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "frontend",
    "dist",
  );

  app.use("/api", notFound);
  app.use(express.static(frontendDistPath));
  app.get("*", (req, res, next) => {
    if (req.path === "/uploads" || req.path.startsWith("/uploads/")) {
      return next();
    }

    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// middleware for handling errors
app.use(notFound);
app.use(errorHandler);

// start the server on defined port
app.listen(PORT, console.log(`Server running on port ${PORT}`));
