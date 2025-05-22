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
  const { cartItems, foodList, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext); // <-- Sửa ở đây

  const navigate = useNavigate();

  const deliveryFee = 2; // Bạn có thể muốn làm cho cái này động
  const subtotal = getTotalCartAmount(); // Lấy subtotal từ hàm
  const totalAmount = subtotal + deliveryFee;

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {/* Thêm kiểm tra foodList trước khi map */}
        {foodList && Array.isArray(foodList) && foodList.map((item) => {
          // Kiểm tra xem item có trong giỏ hàng và số lượng > 0
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
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
          <h2>Cart total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${subtotal}</p> {/* Sử dụng biến subtotal */}
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery</p>
              {/* Điều kiện hiển thị phí giao hàng */}
              <p>${subtotal === 0 ? 0 : deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              {/* Điều kiện tính tổng cuối cùng */}
              <p>${subtotal === 0 ? 0 : totalAmount}</p>
            </div>
          </div>
          <button onClick={()=>navigate('/order')}>Checkout</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>Code</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;