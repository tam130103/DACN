// src/pages/Cart/Cart.jsx
import React, { useContext, useEffect, useMemo, useCallback } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { assets } from "../../assets/assets";

const Cart = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const {
    cartItems,
    foodList = [],
    removeFromCart,
    setCartItems,           // ⬅️ để xoá hẳn một dòng
    getTotalCartAmount,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // Base URL backend
  const API_BASE =
    api?.defaults?.baseURL ||
    import.meta.env.VITE_API_URL ||
    ""; // ví dụ: https://dacn.onrender.com

  // helper format tiền
  const money = useCallback(
    (n) =>
      `$${(Number(n) || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    []
  );

  const deliveryFee = 2;
  const subtotal = Number(getTotalCartAmount?.() || 0);
  const totalAmount = subtotal === 0 ? 0 : subtotal + deliveryFee;

  // build link ảnh an toàn
  const imgSrc = (img) => {
    if (!img) return "";
    if (/^https?:\/\//i.test(img)) return img; // đã là URL tuyệt đối
    return `${API_BASE}/images/${img}`;
  };

  // xoá hẳn 1 dòng (đặt quantity về 0)
  const removeLine = (id) => {
    setCartItems((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const isEmpty =
    !foodList?.some((it) => (cartItems?.[it?._id] || 0) > 0) || subtotal === 0;

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

        {isEmpty ? (
          <div className="cart-empty">
            <p>Giỏ hàng trống. Hãy thêm món nhé!</p>
          </div>
        ) : (
          foodList.map((item) => {
            const qty = cartItems?.[item?._id] || 0;
            if (!item || qty <= 0) return null;

            const price = Number(item.price) || 0;
            const line = price * qty;

            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img
                    src={imgSrc(item.image)}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        assets?.placeholder_img ||
                        assets?.food_menu_placeholder ||
                        "";
                    }}
                  />
                  <p>{item.name}</p>
                  <p>{money(price)}</p>
                  <p>{qty}</p>
                  <p>{money(line)}</p>
                  <p
                    onClick={() => removeLine(item._id)}
                    className="cross"
                    title="Xóa khỏi giỏ"
                  >
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          })
        )}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Tổng cộng giỏ hàng</h2>
          <div>
            <div className="cart-total-details">
              <p>Tạm tính</p>
              <p>{money(subtotal)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí vận chuyển</p>
              <p>{money(subtotal === 0 ? 0 : deliveryFee)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Tổng thanh toán</p>
              <p>{money(totalAmount)}</p>
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
