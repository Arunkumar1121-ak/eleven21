import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Helper: Load cart from localStorage safely
const loadCartFromLocalStorage = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : { products: [] };
  } catch (err) {
    console.error("Error loading cart from localStorage:", err);
    return { products: [] };
  }
};

// ✅ Helper: Save cart to localStorage safely
const saveCartToLocalStorage = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (err) {
    console.error("Error saving cart to localStorage:", err);
  }
};

// 🛒 Fetch cart (for user or guest)
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { params: { userId, guestId } }
      );
      console.log("🟢 [fetchCart] Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("🔴 [fetchCart] Error:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch cart");
    }
  }
);

// 🟩 Add an item to the cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, size, quantity, color, guestId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { productId, quantity, size, color, guestId, userId }
      );
      console.log("🟢 [addToCart] Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("🔴 [addToCart] Error:", error);
      return rejectWithValue(error.response?.data || "Failed to add to cart");
    }
  }
);

// 🟦 Update cart item quantity
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ productId, quantity, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { productId, quantity, guestId, userId, size, color }
      );
      console.log("🟢 [updateCartItemQuantity] Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("🔴 [updateCartItemQuantity] Error:", error);
      return rejectWithValue(error.response?.data || "Failed to update cart item quantity");
    }
  }
);

// 🟥 Remove an item from the cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        data: { productId, guestId, userId, size, color },
      });
      console.log("🟢 [removeFromCart] Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("🔴 [removeFromCart] Error:", error);
      return rejectWithValue(error.response?.data || "Failed to remove from cart");
    }
  }
);

// 🟨 Merge guest cart into user cart
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId, userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        { guestId, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("🟢 [mergeCart] Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("🔴 [mergeCart] Error:", error);
      return rejectWithValue(error.response?.data || "Failed to merge cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromLocalStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      console.warn("🧹 [clearCart] Clearing local cart");
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    // 🛒 Fetch cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("⏳ [fetchCart] Loading...");
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.cart || action.payload;
        console.log("✅ [fetchCart.fulfilled] Final Data:", data);
        if (data) {
          state.cart = data;
          saveCartToLocalStorage(data);
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ➕ Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("⏳ [addToCart] Loading...");
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.cart || action.payload;
        console.log("✅ [addToCart.fulfilled] Final Data:", data);
        if (data) {
          state.cart = data;
          saveCartToLocalStorage(data);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 🔄 Update cart item quantity
    builder
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.cart || action.payload;
        console.log("✅ [updateCartItemQuantity.fulfilled] Final Data:", data);
        if (data) {
          state.cart = data;
          saveCartToLocalStorage(data);
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ❌ Remove from cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.cart || action.payload;
        console.log("✅ [removeFromCart.fulfilled] Final Data:", data);
        if (data) {
          state.cart = data;
          saveCartToLocalStorage(data);
        } else {
          console.warn("⚠️ [removeFromCart] No valid cart returned, keeping previous cart");
        }
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 🔁 Merge cart
    builder
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.cart || action.payload;
        console.log("✅ [mergeCart.fulfilled] Final Data:", data);
        if (data) {
          state.cart = data;
          saveCartToLocalStorage(data);
        }
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
