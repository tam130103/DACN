// src/pages/MyOrders/MyOrders.jsx
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import { api } from "../../api/client";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Định dạng tiền đơn giản ($1,234.00)
  const money = useCallback((n) => {
    const v = Number(n) || 0;
    return `$${v.toLocaleString("vi-VN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, []);

  // Lấy thời gian tạo đơn
  const when = useCallback((o) => {
    const d = new Date(o?.createdAt || o?.date || Date.now());
    return d.toLocaleString("vi-VN");
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!token) {
      setErr("Bạn chưa đăng nhập.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setErr("");
      const res = await api.post(
        "/api/order/userorders",
        {},
        {
          headers: {
            // Backend của bạn hỗ trợ cả 'token' và Bearer. Dùng chuẩn Bearer.
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        const arr = Array.isArray(res.data.data) ? res.data.data : [];
        // Mới nhất lên đầu (ưu tiên createdAt, fallback date)
        arr.sort(
          (a, b) =>
            new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
        );
        setOrders(arr);
      } else {
        setErr(res.data?.message || "Không thể tải đơn hàng.");
      }
    } catch (e) {
      console.error("Fetch orders error:", e?.response?.data || e.message);
      setErr("Không thể tải đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="my-orders">
      <div className="my-orders-header">
        <h2>Đơn hàng của tôi</h2>
        <button className="refresh-btn" onClick={fetchOrders}>
          Tải lại
        </button>
      </div>

      <div className="container">
        {loading ? (
          <p>Đang tải đơn hàng...</p>
        ) : err ? (
          <p className="error-message">{err}</p>
        ) : orders.length === 0 ? (
          <p>Bạn chưa có đơn hàng nào.</p>
        ) : (
          orders.map((order) => {
            const items = order.items || [];
            const status = order.status || "pending";
            const amount = order.amount;

            return (
              <div key={order._id} className="my-orders-order">
                <img src={assets.parcel_icon} alt="Parcel Icon" />

                <div className="order-main">
                  <p className="items">
                    {items.map((it, i) => (
                      <span key={it._id || `${order._id}-${i}`}>
                        {it.name} x {it.quantity}
                        {i < items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>

                  <p className="meta">
                    <span className="label">Thời gian:</span> {when(order)}
                  </p>
                </div>

                <p className="amount">{money(amount)}</p>
                <p className="count">Mặt hàng: {items.length}</p>

                <p className="status">
                  <span className="dot">&#x25CF;</span>{" "}
                  <b>{status}</b>
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
