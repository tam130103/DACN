import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    itemId:    { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem", required: true },
    name:      { type: String, required: true },
    price:     { type: Number, required: true },
    quantity:  { type: Number, required: true, min: 1 },
    description: { type: String, default: "" },
    image:     { type: String, default: "" },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    firstName:  { type: String, required: true },
    lastName:   { type: String, required: true },
    email:      { type: String, default: "" },     // không bắt buộc
    street:     { type: String, required: true },
    city:       { type: String, required: true },

    // ✅ KHÔNG CÒN REQUIRED
    state:      { type: String, required: false, default: "" },
    postalCode: { type: String, required: false, default: "" },
    country:    { type: String, required: false, default: "" },

    phone:      { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items:   {
      type: [itemSchema],
      required: true,
      validate: v => Array.isArray(v) && v.length > 0
    },
    amount:  { type: Number, required: true, min: 0 },
    address: { type: addressSchema, required: true },
    status:  {
      type: String,
      enum: ["Đang xử lý món", "Đang giao hàng", "Đã giao", "Đã hủy"],
      default: "Đang xử lý món",
    },
    date:    { type: Date, default: Date.now },
    payment: { type: Boolean, default: false },
  },
  { timestamps: true } // có createdAt/updatedAt cho tiện sắp xếp
);

// Giữ tên model là "Orders" như bạn đang dùng để tránh OverwriteModelError
const orderModel = mongoose.mo
