const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products");

dotenv.config();

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

// ✅ Function to seed data
const seedData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // Create a default admin user
    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    // Assign admin user ID to each product
    const userId = createdUser._id;
    const sampleProducts = products.map((product) => {
      return { ...product, user: userId };
    });

    // Insert sample products
    await Product.insertMany(sampleProducts);

    console.log("Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(" Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
