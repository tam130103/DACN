// FoodDelivery/admin/src/pages/Orders/Orders.jsx
import React, { useEffect, useState } from "react";
import "./Orders.css";
import { api } from "../../api/client";           // ✅ dùng axios instance
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/order/list");   // backend của bạn đang dùng route này
      if (res.data?.success) {
        setOrders(res.data.data || []);
      } else {
        toast.error(res.data?.message || "Lỗi tải đơn hàng");
      }
    } catch (err) {
      console.error("Fetch orders error:", err?.response?.data || err.message);
      toast.error("Không thể tải đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    const status = event.target.value;
    try {
      const res = await api.post("/api/order/status", { orderId, status });
      if (res.data?.success) {
        toast.success("Cập nhật trạng thái thành công");
        fetchAllOrders();
      } else {
        toast.error(res.data?.message || "Cập nhật trạng thái thất bại");
      }
    } catch (err) {
      console.error("Update status error:", err?.response?.data || err.message);
      toast.error("Không thể cập nhật trạng thái. Thử lại sau.");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) {
    return (
      <div className="order add">
        <h3>Trang đơn hàng</h3>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="order add">
      <h3>Trang đơn hàng</h3>
      <div className="order-list">
        {orders.length === 0 ? (
          <p>Chưa có đơn hàng nào.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-item">
              <img src={assets.parcel_icon} alt="Parcel" />

              <div>
                <p className="order-item-food">
                  {order.items.map((item, idx) => (
                    <span key={`${order._id}-${item.itemId || idx}`}>
                      {item.name} x {item.quantity}
                      {idx < order.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>

                <p className="order-item-name">
                  {(order.address?.firstName || "") +
                    " " +
                    (order.address?.lastName || "")}
                </p>

                <div className="order-item-address">
                  <p>
                    {order.address?.street ? `${order.address.street}, ` : ""}
                    {order.address?.city ? `${order.address.city}, ` : ""}
                    {order.address?.state ? `${order.address.state}, ` : ""}
                    {order.address?.country || ""}
                    {order.address?.postalCode
                      ? `, ${order.address.postalCode}`
                      : ""}
                  </p>
                </div>

                <p className="order-item-phone">{order.address?.phone}</p>
              </div>

              <p>Số món: {order.items?.length || 0}</p>

              <p>
                {Number(order.amount).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>

              <select
                onChange={(e) => statusHandler(e, order._id)}
                value={order.status}
              >
                <option value="Đang xử lý món">Đang xử lý món</option>
                <option value="Đang giao hàng">Đang giao hàng</option>
                <option value="Đã giao">Đã giao</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
