const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const { protect, admin } = require("../middleware/authMiddleware");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Multer setup (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @route   GET /api/admin/products
// @desc    Get all products (Admin only)
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/admin/products/:id
// @desc    Update a product by ID (Admin only)
// @access  Private/Admin
router.put("/:id", protect, admin, upload.array("images"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Allowed fields except images
    const allowedFields = [
      "name", "description", "price", "discountPrice",
      "countInStock", "sku", "category", "brand",
      "sizes", "colors", "collections", "material", "gender",
      "isFeatured", "isPublished", "tags",
      "metaTitle", "metaDescription", "dimensions", "weight"
    ];

    // Update normal fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    // Handle image uploads
    const uploadedImages = [];

    // 1️⃣ Files sent via multipart/form-data
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((err, res) => {
            if (res) resolve(res);
            else reject(err);
          });
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
        uploadedImages.push({ Url: result.secure_url, alt: file.originalname });
      }
    }

    // 2️⃣ Images sent as JSON in req.body
    if (Array.isArray(req.body.images)) {
      req.body.images.forEach(img => {
        if (img.Url) uploadedImages.push(img);
      });
    }

    // Only update images if any are valid
    if (uploadedImages.length > 0) {
      product.images = uploadedImages;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);

  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
