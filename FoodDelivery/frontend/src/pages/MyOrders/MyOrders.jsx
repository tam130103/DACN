// src/pages/MyOrders/MyOrders.jsx
import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext'; // Đã cập nhật đường dẫn import
import axios from 'axios';  
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm state để quản lý trạng thái tải
  const [error, setError] = useState(null); // Thêm state để quản lý lỗi

  const fetchOrders = async () => {
    setLoading(true); // Bắt đầu tải, đặt loading thành true
    setError(null); // Xóa lỗi cũ
    try {
      // Đảm bảo request body trống rỗng được gửi đúng cách nếu backend yêu cầu
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch orders.");
        console.error("API error fetching orders:", response.data.message);
      }
    } catch (err) {
      setError("Không thể tải đơn hàng. Vui lòng thử lại sau.");
      console.error("Network or server error fetching orders:", err);
    } finally {
      setLoading(false); // Kết thúc tải, đặt loading thành false
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      // Nếu không có token, bạn có thể chuyển hướng hoặc hiển thị thông báo
      // navigate('/login'); // Ví dụ: chuyển hướng về trang đăng nhập
      console.warn("No token available to fetch orders.");
      setLoading(false); // Dừng loading nếu không có token để fetch
    }
  }, [token]); // Dependency array: fetch lại khi token thay đổi

  return (
    <div className='my-orders'>
      <h2>Đơn hàng của tôi</h2>
      <div className="container">
        {loading ? (
          <p>Đang tải đơn hàng...</p> // Hiển thị thông báo tải
        ) : error ? (
          <p className="error-message">{error}</p> // Hiển thị thông báo lỗi
        ) : data.length === 0 ? (
          <p>Bạn chưa có đơn hàng nào.</p> // Hiển thị khi không có đơn hàng
        ) : (
          data.map((order) => {
            // Sử dụng order._id làm key vì mỗi đơn hàng có ID duy nhất
            return (
              <div key={order._id} className="my-orders-order">
                <img src={assets.parcel_icon} alt="Parcel Icon" />
                <p>
                  {order.items.map((item, itemIndex) => {
                    // Sử dụng item._id hoặc item.foodId làm key cho từng mặt hàng nếu có
                    // Nếu không, index cũng tạm chấp nhận được ở đây vì đây là danh sách tĩnh bên trong mỗi order
                    return (
                      <span key={itemIndex}>
                        {item.name} x {item.quantity}
                        {itemIndex === order.items.length - 1 ? '' : ', '} {/* Thêm dấu phẩy trừ mục cuối cùng */}
                      </span>
                    );
                  })}
                </p>
                <p>${order.amount}.00</p> {/* Hiển thị tổng tiền đơn hàng, thêm định dạng nếu cần */}
                <p>Mặt hàng: {order.items.length}</p> {/* Tổng số loại mặt hàng */}
                <p><span>&#x25CF;</span> <b>{order.status}</b></p> {/* Trạng thái đơn hàng */}
                <button onClick={fetchOrders}>Theo dõi đơn hàng</button> {/* Nút theo dõi (có thể thêm logic sau) */}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyOrders;