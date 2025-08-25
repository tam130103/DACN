import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem", required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            description: { type: String, required: false },
            image: { type: String, required: false }
        },
    ],
    amount: { type: Number, required: true },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },       // <--- THÊM DÒNG NÀY
        firstName: { type: String, required: true },   // <--- THÊM DÒNG NÀY (Nếu bạn có)
        lastName: { type: String, required: true }    // <--- THÊM DÒNG NÀY (Nếu bạn có)
        
      
    },
    status: {
        type: String,
        enum: ["Đang xử lý món", "Đang giao hàng", "Đã giao", "Đã hủy"],
        default: "Đang xử lý món",
    },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false },
});

const orderModel = mongoose.models.Orders || mongoose.model("Orders", orderSchema);
export default orderModel;