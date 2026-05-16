import userModel from "../models/userModels.js";

// Add to cart
const addToCart = async (req, res) => {
  try {
    // Lấy userId từ req.userId (được thêm bởi authMiddleware)
    const userId = req.userId;
    const { itemId } = req.body;

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
      { new: true }
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
    const userId = req.userId;
    const { itemId } = req.body;

    if (!userId || !itemId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid input data: userId or itemId missing.",
        });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $inc: { [`cartData.${itemId}`]: -1 } },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const currentQty = updatedUser.cartData?.[itemId];
    let cartData = updatedUser.cartData;
    if (!currentQty || currentQty <= 0) {
      await userModel.findByIdAndUpdate(userId, {
        $unset: { [`cartData.${itemId}`]: "" }
      });
      cartData = { ...cartData };
      delete cartData[itemId];
    }

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
    const userId = req.userId;

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

// Delete entire item from cart
const deleteFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;

    if (!userId || !itemId) {
      return res.status(400).json({ success: false, message: "Invalid input data." });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $unset: { [`cartData.${itemId}`]: "" } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = { ...updatedUser.cartData };
    delete cartData[itemId];

    res.status(200).json({ success: true, message: "Item deleted from cart", cartData });
  } catch (error) {
    console.error("Error in deleteFromCart:", error.message);
    res.status(500).json({ success: false, message: "Error deleting item from cart" });
  }
};

export { addToCart, removeFromCart, getCart, deleteFromCart };
