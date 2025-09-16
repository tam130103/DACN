// src/components/LoginPopup/LoginPopup.jsx
import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { api } from '../../api/client';  // ✅ dùng axios instance đã cấu hình baseURL

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState('Đăng nhập');
  const [data, setData] = useState({ name: '', email: '', password: '' });

  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const path = currState === 'Đăng nhập' ? '/api/user/login' : '/api/user/register';
      const res = await api.post(path, data);

      if (res.data?.success) {
        const token = res.data.token;
        if (token) {
          localStorage.setItem('token', token);
        }
        setShowLogin?.(false);
      } else {
        alert(res.data?.message || 'Thao tác thất bại');
      }
    } catch (err) {
      console.error('Error during login/register:', err?.response?.data || err.message);
      alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin?.(false)} src={assets?.cross_icon || ''} alt="Đóng" />
        </div>

        <div className="login-popup-inputs">
          {currState === 'Đăng ký' && (
            <input name="name" onChange={onChangeHandle} value={data.name} type="text" placeholder="Tên của bạn" required />
          )}
          <input name="email" onChange={onChangeHandle} value={data.email} type="email" placeholder="Email của bạn" required />
          <input name="password" onChange={onChangeHandle} value={data.password} type="password" placeholder="Mật khẩu" required />
        </div>

        <button type="submit">{currState === 'Đăng ký' ? 'Tạo tài khoản' : 'Đăng nhập'}</button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>Bằng việc tiếp tục, bạn đồng ý với các Điều khoản và Điều kiện của chúng tôi.</p>
        </div>

        {currState === 'Đăng nhập' ? (
          <p> Tạo tài khoản mới? <span onClick={() => setCurrState('Đăng ký')}>Nhấn vào đây</span></p>
        ) : (
          <p> Đã có tài khoản? <span onClick={() => setCurrState('Đăng nhập')}>Nhấn vào đây</span></p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
