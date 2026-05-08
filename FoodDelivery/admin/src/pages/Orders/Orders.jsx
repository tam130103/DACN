// FoodDelivery/admin/src/pages/Orders/Orders.jsx
import React, { useEffect, useState, useCallback } from "react";
import "./Orders.css";
import { api } from "../../api/client";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const getOrderTime = (o = {}) => {
  // Ưu tiên createdAt -> date -> fallback theo _id (timestamp của ObjectId)
  if (o.createdAt) return new Date(o.createdAt).getTime();
  if (o.date)      return new Date(o.date).getTime();
  if (o._id && typeof o._id === "string" && o._id.length >= 8) {
    try {
      return parseInt(o._id.substring(0, 8), 16) * 1000;
    } catch {}
  }
  return 0;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/order/list");
      if (res.data?.success) {
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        // 👇 Sắp xếp mới nhất trước
        data.sort((a, b) => getOrderTime(b) - getOrderTime(a));
        setOrders(data);
      } else {
        toast.error(res.data?.message || "Lỗi tải đơn hàng");
      }
    } catch (err) {
      console.error("Fetch orders error:", err?.response?.data || err.message);
      toast.error("Không thể tải đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  const statusHandler = async (event, orderId) => {
    const status = event.target.value;
    try {
      const res = await api.post("/api/order/status", { orderId, status });
      if (res.data?.success) {
        toast.success("Cập nhật trạng thái thành công");
        fetchAllOrders(); // reload & vẫn giữ sort
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
  }, [fetchAllOrders]);

  if (loading) {
    return (
      <div className="order flex-col">
        <div className="order-container">
          <h2>Quản lý đơn hàng</h2>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order flex-col">
      <div className="order-container">
        <h2>Quản lý đơn hàng</h2>
        <div className="order-list">
          {orders.length === 0 ? (
            <p>Chưa có đơn hàng nào.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="order-item">
                <img src={assets.parcel_icon} alt="Parcel" />

                <div className="order-item-details">
                  <p className="order-item-food">
                    {order.items?.map((item, idx) => (
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
                    <p className="order-item-phone">{order.address?.phone}</p>
                  </div>
                </div>

                <p>Số món: {order.items?.length || 0}</p>

                <p className="order-item-price">
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
    </div>
  );
};

export default Orders;
