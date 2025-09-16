// src/pages/Cart/Cart.jsx
import React, { useContext, useEffect, useMemo } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { cartItems, foodList = [], removeFromCart, getTotalCartAmount } =
    useContext(StoreContext);

  const navigate = useNavigate();

  // Base URL backend (Render)
  const API_BASE = import.meta.env.VITE_API_URL; // e.g. https://dacn.onrender.com

  // format tiền (hiển thị dấu phẩy, vẫn dùng ký hiệu $ như UI của bạn)
  const fmt = useMemo(
    () => new Intl.NumberFormat("vi-VN", { minimumFractionDigits: 0 }),
    []
  );

  const deliveryFee = 2;
  const subtotal = getTotalCartAmount?.() || 0;
  const totalAmount = subtotal === 0 ? 0 : subtotal + deliveryFee;

  // hàm build link ảnh an toàn
  const imgSrc = (img) => {
    if (!img) return "";
    if (/^https?:\/\//i.test(img)) return img; // đã là URL tuyệt đối
    return `${API_BASE}/images/${img}`;
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Sản phẩm</p>
          <p>Tên sản phẩm</p>
          <p>Đơn giá</p>
          <p>Số lượng</p>
          <p>Thành tiền</p>
          <p>Xóa</p>
        </div>
        <br />
        <hr />

        {Array.isArray(foodList) &&
          foodList.map((item) => {
            const qty = cartItems?.[item?._id] || 0;
            if (!item || qty <= 0) return null;

            const price = Number(item.price) || 0;
            const line = price * qty;

            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={imgSrc(item.image)} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${fmt.format(price)}</p>
                  <p>{qty}</p>
                  <p>${fmt.format(line)}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Tổng cộng giỏ hàng</h2>
          <div>
            <div className="cart-total-details">
              <p>Tạm tính</p>
              <p>${fmt.format(subtotal)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí vận chuyển</p>
              <p>${fmt.format(subtotal === 0 ? 0 : deliveryFee)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Tổng thanh toán</p>
              <p>${fmt.format(totalAmount)}</p>
            </div>
          </div>
          <button
            disabled={subtotal === 0}
            onClick={() => navigate("/order")}
            title={subtotal === 0 ? "Giỏ hàng trống" : "Tiến hành thanh toán"}
          >
            Tiến hành thanh toán
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>Mã khuyến mãi</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Nhập mã khuyến mãi" />
              <button>Áp dụng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
