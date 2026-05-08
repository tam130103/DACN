// src/pages/PlaceOrder/PlaceOrder.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { api } from "../../api/client";
import { useNavigate } from "react-router-dom";

const DELIVERY_FEE = 2; // chỉ dùng để hiển thị ở UI

const PlaceOrder = () => {
  const {
    getTotalCartAmount,
    token,
    cartItems = {},
    setCartItems,
    foodMap = {},
    foodList = [],
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Tính subtotal ở client chỉ để hiển thị
  const currentSubtotal = useMemo(() => Number(getTotalCartAmount?.() || 0), [getTotalCartAmount]);
  const displayDeliveryFee = currentSubtotal > 0 ? DELIVERY_FEE : 0;
  const displayTotalAmount = currentSubtotal > 0 ? currentSubtotal + DELIVERY_FEE : 0;

  // Nếu giỏ trống (sau khi food đã load) thì quay về cart
  useEffect(() => {
    // Khi đã có foodList (hoặc có cartItems) mà subtotal = 0 thì điều hướng
    if ((foodList?.length || Object.keys(cartItems || {}).length) && currentSubtotal === 0) {
      navigate("/cart");
    }
  }, [foodList, cartItems, currentSubtotal, navigate]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    // Các field bắt buộc theo backend
    const requiredKeys = ["firstName", "lastName", "email", "street", "city", "phone"];
    for (const k of requiredKeys) {
      if (!String(data[k] || "").trim()) {
        setError("Vui lòng nhập đầy đủ thông tin giao hàng.");
        return false;
      }
    }
    // Phone 10–15 chữ số, có thể có dấu +
    if (!/^\+?\d{10,15}$/.test(data.phone)) {
      setError("Số điện thoại phải từ 10 đến 15 chữ số.");
      return false;
    }
    setError("");
    return true;
  };

  const buildOrderItems = () => {
    // Gửi tối thiểu theo backend: { itemId, quantity }
    // Ưu tiên map theo cartItems để không phụ thuộc vào foodList load
    const items = [];
    for (const [id, qty] of Object.entries(cartItems)) {
      const quantity = Number(qty) || 0;
      if (quantity <= 0) continue;

      // Optional: xác thực id tồn tại trong foodMap/foodList
      const known =
        (foodMap && foodMap[id]) ||
        (Array.isArray(foodList) && foodList.find((f) => String(f._id) === String(id)));
      if (!known) {
        // Bỏ qua item lạ để tránh backend báo lỗi
        continue;
      }
      items.push({ itemId: id, quantity });
    }
    return items;
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    if (!token) {
      setError("Bạn chưa đăng nhập.");
      return;
    }

    const orderItems = buildOrderItems();
    if (orderItems.length === 0) {
      setError("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm.");
      return;
    }

    setIsLoading(true);
    try {
      // Backend tự tính tiền từ DB → chỉ cần gửi address + items
      const payload = { address: data, items: orderItems };

      const res = await api.post("/api/order/place", payload, {
        headers: {
          Authorization: `Bearer ${token}`, // chuẩn Bearer
          // nếu bạn vẫn dùng header 'token', backend cũng hỗ trợ:
          // token,
        },
      });

      if (res.data?.success) {
        // Xóa giỏ trước khi rời trang
        setCartItems({});
        if (res.data.session_url) {
          window.location.replace(res.data.session_url); // tới Stripe Checkout
          return;
        }
        navigate("/myorders");
      } else {
        setError(res.data?.message || "Không thể đặt hàng. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi khi đặt hàng:", err?.response?.data || err.message);
      setError(err?.response?.data?.message || "Đã xảy ra lỗi khi đặt hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      {error && <div className="error-message">{error}</div>}

      <div className="place-order-left">
        <p className="title">Thông tin giao hàng</p>

        <div className="muti-fields">
          <input
            required
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Tên"
          />
          <input
            required
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Họ"
          />
        </div>

        <input
          required
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          type="email"
          placeholder="Địa chỉ email"
        />

        <input
          required
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          type="text"
          placeholder="Đường/Phố"
        />

        <div className="muti-fields">
          <input
            required
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            type="text"
            placeholder="Thành phố"
          />
          {/* state/country/postalCode là optional theo backend nên bỏ ở UI */}
        </div>

        <input
          required
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          type="text"
          placeholder="Số điện thoại"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Tổng cộng giỏ hàng</h2>
          <div>
            <div className="cart-total-details">
              <p>Tạm tính</p>
              <p>${currentSubtotal.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí vận chuyển</p>
              <p>${displayDeliveryFee.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Tổng thanh toán</p>
              <p>${displayTotalAmount.toFixed(2)}</p>
            </div>
          </div>

          <button
            type="submit"
            className={`payment-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading || currentSubtotal === 0}
            title={currentSubtotal === 0 ? "Giỏ hàng trống" : "Thanh toán"}
          >
            {isLoading ? "Đang xử lý..." : "Thanh toán"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
