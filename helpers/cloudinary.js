const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new multer.memoryStorage();

const { Readable } = require("stream");

async function imageUploadUtil(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          return reject("Image upload failed");
        }
        console.log("✅ Cloudinary Upload Success:", result.secure_url);
        resolve(result.secure_url); // ✅ Return the uploaded image URL
      }
    );
    uploadStream.end(buffer);
  });
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed!"), false);
    }
    cb(null, true);
  },
});

module.exports = { upload, imageUploadUtil };
