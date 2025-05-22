import userModel from "../models/userModels.js";

// Add to cart
const addToCart = async (req, res) => {
  try {
    // Lấy userId từ req.userId (được thêm bởi authMiddleware)
    const userId = req.userId; // <-- THAY ĐỔI Ở ĐÂY
    const { itemId } = req.body; // Kiểm tra dữ liệu đầu vào

    if (!userId || !itemId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid input data: userId or itemId missing.",
        });
    } // Tìm và cập nhật giỏ hàng

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $inc: { [`cartData.${itemId}`]: 1 } },
      { new: true, upsert: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cartData: updatedUser.cartData,
    });
  } catch (error) {
    console.error("Error in addToCart:", error.message);
    res.status(500).json({
      success: false,
      message: "Error in adding item to cart",
    });
  }
};

// Remove from cart
const removeFromCart = async (req, res) => {
  try {
    // Lấy userId từ req.userId (được thêm bởi authMiddleware)
    const userId = req.userId; // <-- THAY ĐỔI Ở ĐÂY
    const { itemId } = req.body; // Kiểm tra dữ liệu đầu vào

    if (!userId || !itemId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid input data: userId or itemId missing.",
        });
    } // Tìm và cập nhật giỏ hàng

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};
    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    } else {
      return res
        .status(400)
        .json({
          success: false,
          message: "Item not in cart or quantity is already zero.",
        });
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cartData,
    });
  } catch (error) {
    console.error("Error in removeFromCart:", error.message);
    res.status(500).json({
      success: false,
      message: "Error in removing item from cart",
    });
  }
};

// Fetch cart
const getCart = async (req, res) => {
  try {
    // Lấy userId từ req.userId (được thêm bởi authMiddleware)
    const userId = req.userId; // <-- THAY ĐỔI Ở ĐÂY // Kiểm tra dữ liệu đầu vào

    if (!userId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid input data: userId missing.",
        });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      cartData: userData.cartData,
    });
  } catch (error) {
    console.error("Error in getCart:", error.message);
    res.status(500).json({
      success: false,
      message: "Error in fetching cart data",
    });
  }
};

export { addToCart, removeFromCart, getCart };
