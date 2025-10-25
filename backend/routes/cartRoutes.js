const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to get a cart by userId or guestId
const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

// @route   POST /api/cart
// @desc    Add a product to the cart for a guest or logged-in user
// @access  Public
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Determine if the user is logged in or a guest
    let cart = await getCart(userId, guestId);

    if (cart) {
      // Check if product already exists in the cart
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        // If the product already exists, update the quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // Otherwise, add a new product entry
        cart.products.push({
          productId,
          name: product.name,
          image: product.images?.[0]?.Url || product.image,
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      // Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json({ message: "Cart updated successfully", cart });
    } else {
      // Create a new cart for the guest or user
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images?.[0]?.Url || product.image,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });

      return res.status(201).json({ message: "New cart created", cart: newCart });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// @route   PUT /api/cart
// @desc    Update product quantity in cart
// @access  Public
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    // Fetch cart for guest or logged-in user
    let cart = await getCart(userId, guestId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find product in the cart
    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      // Update quantity or remove item if quantity <= 0
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1); // remove product
      }

      // Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(400).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});



// @route   DELETE /api/cart
// @desc    Remove a product from the cart
// @access  Public
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      // Remove the product
      cart.products.splice(productIndex, 1);

      // Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});




// @route   GET /api/cart
// @desc    Get logged-in user's or guest user's cart
// @access  Public
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// @route   POST /api/cart/merge
// @desc    Merge guest cart into user cart on login
// @access  Private
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;

  try {
    // Find the guest cart and user cart
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    // If guest cart exists
    if (guestCart) {
      // If guest cart is empty
      if (guestCart.products.length === 0) {
        return res.status(404).json({ message: "Guest cart not found or empty" });
      }

      // If user cart exists
      if (userCart) {
        // Merge guest cart items into user cart
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );

          if (productIndex > -1) {
            // Increase quantity if same product exists
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            // Otherwise, add new product
            userCart.products.push(guestItem);
          }
        });

        // Recalculate total price
        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        await userCart.save();

        // Delete guest cart after merging
        try {
          await Cart.deleteOne({ guestId });
        } catch (error) {
          console.error("Error deleting guest cart:", error);
        }

        return res.status(200).json(userCart);
      } else {
        // If user has no cart, assign guest cart to user
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();
        return res.json(guestCart);
      }
    } else {
      // If guest cart doesn't exist but user cart exists
      if (userCart) {
        return res.status(200).json(userCart);
      } else {
        return res.status(404).json({ message: "No carts found" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
