// src/pages/PlaceOrder/PlaceOrder.jsx
import React, { useContext, useState, useEffect } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { api } from "../../api/client";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, foodList = [], cartItems, setCartItems } =
    useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    if (!/^\+?\d{10,15}$/.test(data.phone)) {
      setError("Số điện thoại phải từ 10 đến 15 chữ số.");
      return false;
    }
    if (data.postalCode && !/^\d{4,10}$/.test(data.postalCode)) {
      setError("Mã bưu chính phải từ 4 đến 10 chữ số.");
      return false;
    }
    setError("");
    return true;
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    if (!token) {
      setError("Bạn chưa đăng nhập.");
      return;
    }

    setIsLoading(true);

    // Bảo vệ khi foodList chưa sẵn sàng
    if (!Array.isArray(foodList) || foodList.length === 0) {
      setError("Dữ liệu món ăn chưa tải xong. Vui lòng thử lại.");
      setIsLoading(false);
      return;
    }

    // Tạo danh sách item từ cartItems
    const orderItems = foodList
      .filter((it) => cartItems?.[it?._id] > 0)
      .map((it) => ({
        itemId: it._id,
        name: it.name,
        price: Number(it.price) || 0,
        quantity: cartItems[it._id],
        description: it.description || "Mô tả sản phẩm không có",
      }));

    if (orderItems.length === 0) {
      setError("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm.");
      setIsLoading(false);
      return;
    }

    const DELIVERY_FEE = 2;
    const subtotal = Number(getTotalCartAmount?.() || 0);
    const amount = subtotal + DELIVERY_FEE;

    const orderData = {
      address: data,
      items: orderItems,
      amount, // nếu backend dùng Stripe theo đơn vị cents thì backend sẽ tự quy đổi
    };

    try {
      const res = await api.post("/api/order/place", orderData, {
        headers: { token },
      });

      if (res.data?.success) {
        // Nếu backend trả về session_url (Stripe Checkout)
        if (res.data.session_url) {
          setCartItems({});
          window.location.replace(res.data.session_url);
          return;
        }
        // Hoặc chuyển tới trang "đơn hàng của tôi" khi không dùng Stripe
        setCartItems({});
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

  // Nếu giỏ hàng rỗng (sau khi data đã tải) thì quay về Cart
  useEffect(() => {
    if (Array.isArray(foodList) && foodList.length > 0 && (getTotalCartAmount?.() || 0) === 0) {
      navigate("/cart");
    }
  }, [foodList, getTotalCartAmount, navigate]);

  const DELIVERY_FEE = 2;
  const currentSubtotal = Number(getTotalCartAmount?.() || 0);
  const displayDeliveryFee = currentSubtotal > 0 ? DELIVERY_FEE : 0;
  const displayTotalAmount = currentSubtotal > 0 ? currentSubtotal + DELIVERY_FEE : 0;

  return (
    <form onSubmit={placeOrder} className="place-order">
      {error && <div className="error-message">{error}</div>}

      <div className="place-order-left">
        <p className="title">Thông tin giao hàng</p>

        <div className="muti-fields">
          <input required name="firstName" value={data.firstName} onChange={onChangeHandler} type="text" placeholder="Tên" />
          <input required name="lastName" value={data.lastName} onChange={onChangeHandler} type="text" placeholder="Họ" />
        </div>

        <input required name="email" value={data.email} onChange={onChangeHandler} type="email" placeholder="Địa chỉ email" />
        <input required name="street" value={data.street} onChange={onChangeHandler} type="text" placeholder="Đường/Phố" />

        <div className="muti-fields">
          <input required name="city" value={data.city} onChange={onChangeHandler} type="text" placeholder="Thành phố" />
          <input required name="state" value={data.state} onChange={onChangeHandler} type="text" placeholder="Tỉnh/Bang" />
        </div>

        <div className="muti-fields">
          <input name="postalCode" value={data.postalCode} onChange={onChangeHandler} type="text" placeholder="Mã bưu chính" />
          <input required name="country" value={data.country} onChange={onChangeHandler} type="text" placeholder="Quốc gia" />
        </div>

        <input required name="phone" value={data.phone} onChange={onChangeHandler} type="text" placeholder="Số điện thoại" />
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
            {isLo
