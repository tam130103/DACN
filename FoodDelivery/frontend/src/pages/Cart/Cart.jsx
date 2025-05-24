// src/pages/Cart/Cart.jsx

import React, { useContext, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // THAY ĐỔI food_list THÀNH foodList VÀ ĐẢM BẢO LẤY getTotalCartAmount
  const { cartItems, foodList, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext); // <-- Đã thay đổi ở đây

  const navigate = useNavigate();

  const deliveryFee = 2; // Bạn có thể muốn đặt giá trị này động
  const subtotal = getTotalCartAmount(); // Lấy tổng tạm tính từ hàm
  const totalAmount = subtotal + deliveryFee;

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
        {/* Thêm kiểm tra foodList trước khi lặp */}
        {foodList && Array.isArray(foodList) && foodList.map((item) => {
          // Kiểm tra xem sản phẩm có trong giỏ hàng và số lượng lớn hơn 0
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price.toLocaleString('vi-VN')}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${(item.price * cartItems[item._id]).toLocaleString('vi-VN')}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">x</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Tổng cộng giỏ hàng</h2>
          <div>
            <div className="cart-total-details">
              <p>Tạm tính</p>
              <p>${subtotal.toLocaleString('vi-VN')}</p> {/* Sử dụng biến tổng tạm tính */}
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí vận chuyển</p>
              {/* Điều kiện hiển thị phí vận chuyển */}
              <p>${(subtotal === 0 ? 0 : deliveryFee).toLocaleString('vi-VN')}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Tổng thanh toán</p>
              {/* Điều kiện tính tổng cuối cùng */}
              <p>${(subtotal === 0 ? 0 : totalAmount).toLocaleString('vi-VN')}</p>
            </div>
          </div>
          <button onClick={()=>navigate('/order')}>Tiến hành thanh toán</button>
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