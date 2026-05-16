// backend/controllers/orderController.js
import orderModel from "../models/orderModels.js";
import userModel from "../models/userModels.js";
import foodModel from "../models/foodModels.js";
import Stripe from "stripe";

// --- ENV checks ---
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("⚠️ STRIPE_SECRET_KEY is missing. Stripe payments will fail.");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// helpers
const asString = (v) => (typeof v === "string" ? v.trim() : String(v || "").trim());
const isTrue = (v) => v === true || v === "true" || v === 1 || v === "1";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount: clientAmount, address } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Giỏ hàng rỗng hoặc không hợp lệ." });
    }
    if (!address) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin địa chỉ." });
    }

    const cleanAddress = {
      firstName: asString(address.firstName),
      lastName: asString(address.lastName),
      email: asString(address.email),
      street: asString(address.street),
      city: asString(address.city),
      state: asString(address.state || ""),
      postalCode: asString(address.postalCode || ""),
      country: asString(address.country || ""),
      phone: asString(address.phone),
    };

    for (const key of ["firstName", "lastName", "email", "street", "city", "phone"]) {
      if (!cleanAddress[key]) {
        return res.status(400).json({ success: false, message: `Thiếu trường địa chỉ: ${key}` });
      }
    }
    if (cleanAddress.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanAddress.email)) {
      return res.status(400).json({ success: false, message: "Email không hợp lệ." });
    }

    const SHIPPING_FEE_MINOR = 200;
    const CURRENCY = "usd";

    const populatedItems = [];
    let itemsTotalMinor = 0;

    for (const cartItem of items) {
      const { itemId, quantity } = cartItem || {};
      const qty = Number(quantity) || 0;
      if (!itemId || qty <= 0) continue;

      const food = await foodModel.findById(itemId);
      if (!food) {
        return res.status(400).json({
          success: false,
          message: `Món ăn không tồn tại hoặc đã bị xóa (id: ${itemId}).`,
        });
      }

      const priceMinor = Math.round(Number(food.price) * 100);
      itemsTotalMinor += priceMinor * qty;

      populatedItems.push({
        itemId: String(food._id),
        name: food.name,
        price: Number(food.price),
        quantity: qty,
        description: food.description || "",
        image: food.image || "",
      });
    }

    if (populatedItems.length === 0) {
      return res.status(400).json({ success: false, message: "Không có món hợp lệ trong đơn hàng." });
    }

    const serverTotalMinor = itemsTotalMinor + SHIPPING_FEE_MINOR;
    const serverTotal = serverTotalMinor / 100;

    if (typeof clientAmount === "number" && Math.abs(Number(clientAmount) - serverTotal) > 0.01) {
      console.warn("⚠️ Client amount mismatch. client:", clientAmount, "server:", serverTotal);
    }

    const newOrder = new orderModel({
      userId,
      items: populatedItems,
      amount: serverTotal,
      address: cleanAddress,
      payment: false,
      status: "Đang xử lý món",
    });
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = populatedItems.map((it) => ({
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: it.name,
          description: it.description || "Sản phẩm",
        },
        unit_amount: Math.round(it.price * 100),
      },
      quantity: it.quantity,
    }));

    line_items.push({
      price_data: {
        currency: CURRENCY,
        product_data: { name: "Phí giao hàng" },
        unit_amount: SHIPPING_FEE_MINOR,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
    });

    return res.json({
      success: true,
      session_url: session.url,
      orderId: newOrder._id,
    });
  } catch (err) {
    console.error("💥 placeOrder error:", err);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server khi đặt hàng. Vui lòng thử lại.",
      error: err.message,
    });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    const { orderId, success, sessionId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: "ID đơn hàng là bắt buộc." });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng." });
    }

    if (isTrue(success)) {
      if (!sessionId) {
        return res.status(400).json({ success: false, message: "Thiếu sessionId để xác thực thanh toán." });
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        await orderModel.findByIdAndUpdate(orderId, { payment: true });
        return res.json({ success: true, message: "Thanh toán thành công." });
      } else {
        return res.status(400).json({ success: false, message: "Thanh toán chưa được hoàn tất trên Stripe." });
      }
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Thanh toán thất bại, đơn hàng đã bị hủy." });
    }
  } catch (err) {
    console.error("💥 verifyOrder error:", err);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server khi xác minh đơn hàng. Vui lòng thử lại.",
      error: err.message,
    });
  }
};

export const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    return res.json({ success: true, data: orders });
  } catch (err) {
    console.error("💥 userOrders error:", err);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server khi tải đơn hàng.",
      error: err.message,
    });
  }
};

export const listOrders = async (_req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    return res.json({ success: true, data: orders });
  } catch (err) {
    console.error("💥 listOrders error:", err);
    return res.status(500).json({ success: false, message: "Error", error: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body || {};
    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Thiếu orderId hoặc status" });
    }
    await orderModel.findByIdAndUpdate(orderId, { status });
    return res.json({ success: true, message: "Status Updated" });
  } catch (err) {
    console.error("💥 updateStatus error:", err);
    return res.status(500).json({ success: false, message: "Error", error: err.message });
  }
};
