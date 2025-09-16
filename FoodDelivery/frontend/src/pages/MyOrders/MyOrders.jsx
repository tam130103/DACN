// src/pages/MyOrders/MyOrders.jsx
import React, { useContext, useEffect, useState, useMemo } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import { api } from "../../api/client";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // format tiền
  const fmt = useMemo(
    () => new Intl.NumberFormat("vi-VN", { minimumFractionDigits: 0 }),
    []
  );

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(
        "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (res.data?.success) {
        const arr = Array.isArray(res.data.data) ? res.data.data : [];
        // sắp xếp mới nhất trước (ưu tiên date/createdAt)
        const sorted = [...arr].sort(
          (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
        );
        setData(sorted);
      } else {
        setError(res.data?.message || "Không thể tải đơn hàng.");
      }
    } catch (e) {
      setError("Không thể tải đơn hàng. Vui lòng thử lại sau.");
      console.error("Fetch orders error:", e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
      setError("Bạn chưa đăng nhập.");
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>Đơn hàng của tôi</h2>
      <div className="container">
        {loading ? (
          <p>Đang tải đơn hàng...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : data.length === 0 ? (
          <p>Bạn chưa có đơn hàng nào.</p>
        ) : (
          data.map((order) => {
            const items = order.items || [];
            const amount = Number(order.amount) || 0;
            const status = order.status || "pending";

            return (
              <div key={order._id} className="my-orders-order">
                <img src={assets.parcel_icon} alt="Parcel Icon" />
                <p className="items">
                  {items.map((it, i) => (
                    <span key={it._id || i}>
                      {it.name} x {it.quantity}
                      {i === items.length - 1 ? "" : ", "}
                    </span>
                  ))}
                </p>
                <p className="amount">${fmt.format(amount)}.00</p>
                <p className="count">Mặt hàng: {items.length}</p>
                <p className="status">
                  <span>&#x25CF;</span> <b>{status}</b>
                </p>
                <button onClick={fetchOrders}>Cập nhật đơn hàng</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyOrders;
