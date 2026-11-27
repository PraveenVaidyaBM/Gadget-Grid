import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const uploadsDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "uploads",
);

const imageExtensions = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    fs.mkdir(uploadsDirectory, { recursive: true }, (error) => {
      callback(error, uploadsDirectory);
    });
  },
  filename(_req, file, callback) {
    callback(
      null,
      `${randomBytes(16).toString("hex")}${imageExtensions[file.mimetype]}`,
    );
  },
});

const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter(_req, file, callback) {
    if (!imageExtensions[file.mimetype]) {
      const error = new Error("Upload a JPEG, PNG, WebP, or GIF image.");
      error.statusCode = 400;
      callback(error);
      return;
    }

    callback(null, true);
  },
}).single("image");

export const UPLOADS_DIRECTORY = uploadsDirectory;

export const uploadProductImage = (req, res, next) => {
  uploadImage(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError || error.statusCode === 400) {
        res.status(400);
        if (
          error instanceof multer.MulterError &&
          error.code === "LIMIT_FILE_SIZE"
        ) {
          error.message = "Image files must be 5 MB or smaller.";
        }
      }
      next(error);
      return;
    }

    next();
  });
};
