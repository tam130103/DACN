// orderController.js

import orderModel from "../models/orderModels.js";
import userModel from "../models/userModels.js";
import Stripe from "stripe";
import foodModel from "../models/foodModels.js"; // ĐẢM BẢO BẠN CÓ DÒNG NÀY ĐỂ IMPORT FOOD MODEL

// Kiểm tra biến môi trường quan trọng khi ứng dụng khởi động
if (!process.env.STRIPE_SECRET_KEY) {
  console.error(
    "LỖI: STRIPE_SECRET_KEY bị thiếu trong biến môi trường. Vui lòng kiểm tra file .env"
  );
  process.exit(1); // Thoát ứng dụng nếu khóa bí mật không có
}
if (!process.env.FRONTEND_URL) {
  console.warn(
    "CẢNH BÁO: FRONTEND_URL bị thiếu trong biến môi trường. Mặc định là http://localhost:5173"
  );
}

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Hàm xử lý đặt hàng
const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address } = req.body;

    // --- DEBUGGING LOGS (Bạn có thể xóa sau khi mọi thứ hoạt động) ---
    console.log("\n--- Bắt đầu PlaceOrder ---");
    console.log("Backend: userId từ middleware:", userId);
    console.log(
      "Backend: Dữ liệu body nhận được:",
      JSON.stringify(req.body, null, 2)
    );
    // --- END DEBUGGING LOGS ---

    if (!userId) {
      console.error(
        "Backend: Lỗi xác thực: User ID không tìm thấy trong req.userId."
      );
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized: Vui lòng đăng nhập lại.",
        });
    }
    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !amount ||
      !address
    ) {
      console.error(
        "Backend: Lỗi xác thực: Dữ liệu giỏ hàng (items) hoặc địa chỉ (address) hoặc tổng tiền (amount) không hợp lệ."
      );
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Dữ liệu đơn hàng không hợp lệ. Vui lòng kiểm tra lại giỏ hàng và thông tin giao hàng.",
        });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      console.error(
        "Backend: Lỗi: Không tìm thấy người dùng với User ID:",
        userId
      );
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại." });
    }

    // ====================================================================
    // THAY ĐỔI QUAN TRỌNG: LẤY THÔNG TIN FOODITEM VÀ LƯU VÀO ĐƠN HÀNG
    const populatedItems = [];
    for (const cartItem of items) {
      const food = await foodModel.findById(cartItem.itemId); // Tìm FoodItem bằng itemId

      if (food) {
        populatedItems.push({
          itemId: cartItem.itemId,
          name: food.name,           // Lấy tên từ Food Model
          price: food.price,         // Lấy giá từ Food Model
          quantity: cartItem.quantity,
          description: food.description, // Lấy mô tả từ Food Model
          image: food.image          // Lấy tên file ảnh từ Food Model
        });
      } else {
        // Xử lý trường hợp không tìm thấy món ăn (ví dụ: log lỗi, bỏ qua món này, hoặc trả về lỗi)
        console.warn(`Food item with ID ${cartItem.itemId} not found during order placement. This item will be skipped or cause an error.`);
        // Tùy chọn: bạn có thể trả về lỗi hoặc chỉ thêm một placeholder item
        // return res.json({ success: false, message: `Món ăn với ID ${cartItem.itemId} không tồn tại.` });
        populatedItems.push({ // Thêm placeholder nếu món ăn không tồn tại
          itemId: cartItem.itemId,
          name: "Món ăn không tồn tại",
          price: 0,
          quantity: cartItem.quantity,
          description: "Món ăn này đã bị xóa hoặc không hợp lệ.",
          image: ""
        });
      }
    }
    // ====================================================================

    const newOrder = new orderModel({
      userId,
      items: populatedItems, // SỬ DỤNG MẢNG ĐÃ ĐƯỢC POPULATE CÁC THÔNG TIN NAME, PRICE, DESCRIPTION, IMAGE
      amount,
      address,
      payment: false,
    });
    await newOrder.save();
    console.log(
      "Backend: Đơn hàng mới đã được tạo và lưu với ID:",
      newOrder._id
    );

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    console.log("Backend: Giỏ hàng của người dùng", userId, "đã được xóa.");

    const line_items = populatedItems.map((item) => { // SỬ DỤNG populatedItems Ở ĐÂY CŨNG ĐỂ ĐẢM BẢO CÓ NAME VÀ DESCRIPTION CHO STRIPE
      const productDescription =
        item.description && item.description.trim() !== ""
          ? item.description
          : "Sản phẩm không có mô tả";

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
            description: productDescription,
            // Nếu bạn có URL hình ảnh hợp lệ cho Stripe, hãy thêm vào đây.
            // images: item.image ? [`${FRONTEND_URL}/images/${item.image}`] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Phí giao hàng",
        },
        unit_amount: 200,
      },
      quantity: 1,
    });

    console.log(
      "Backend: Line Items được gửi đến Stripe:",
      JSON.stringify(line_items, null, 2)
    );

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({
      success: true,
      session_url: session.url,
      orderId: newOrder._id,
    });
    console.log("Backend: Stripe Session URL đã được tạo:", session.url);
  } catch (error) {
    console.error("Backend: LỖI KHI ĐẶT HÀNG:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server khi đặt hàng. Vui lòng thử lại.",
      error: error.message,
    });
  }
};

// Hàm xử lý xác minh đơn hàng sau khi thanh toán từ Stripe
const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;

    if (!orderId) {
      console.error("Backend: Lỗi xác minh đơn hàng: ID đơn hàng là bắt buộc.");
      return res
        .status(400)
        .json({ success: false, message: "ID đơn hàng là bắt buộc." });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      console.warn(
        "Backend: Cảnh báo: Không tìm thấy đơn hàng để xác minh với ID:",
        orderId
      );
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng." });
    }

    if (success === true || success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      console.log(
        "Backend: Đơn hàng",
        orderId,
        "đã được cập nhật thành công (payment: true)."
      );
      res.json({ success: true, message: "Thanh toán thành công." });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      console.log(
        "Backend: Thanh toán thất bại. Đơn hàng",
        orderId,
        "đã bị xóa."
      );
      res.json({
        success: false,
        message: "Thanh toán thất bại, đơn hàng đã bị hủy.",
      });
    }
  } catch (error) {
    console.error("Backend: LỖI KHI XÁC MINH ĐƠN HÀNG:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server khi xác minh đơn hàng. Vui lòng thử lại.",
      error: error.message,
    });
  }
};

// Hàm lấy tất cả đơn hàng của một người dùng (dành cho frontend hiển thị lịch sử đơn hàng)
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      console.error(
        "Backend: Lỗi: User ID không tìm thấy trong req.userId khi lấy đơn hàng người dùng."
      );
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized: User ID không tìm thấy.",
        });
    }

    // Không cần populate ở đây vì bạn đã lưu name/price/description/image trực tiếp vào order.items
    const orders = await orderModel.find({ userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Backend: LỖI KHI TẢI ĐƠN HÀNG CỦA NGƯỜNG DÙNG:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi server khi tải đơn hàng. Vui lòng thử lại.",
      error: error.message,
    });
  }
};

const listOrders = async (req, res) => {
    try {
      // Tương tự, không cần populate ở đây vì bạn đã lưu name/price/description/image trực tiếp vào order.items
      const orders = await orderModel.find({});
      res.json({success:true,data:orders})
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"})
    }
}

  const updateStatus = async (req,res) => {
    try {
      await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
      res.json({success:true,message:"Status Updated"})
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"})
    }
  }

// Export các hàm để sử dụng trong routes
export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };