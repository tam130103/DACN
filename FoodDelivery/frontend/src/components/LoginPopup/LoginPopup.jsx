// src/components/LoginPopup/LoginPopup.jsx
import React, { useState, useContext } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { api } from "../../api/client";
import { StoreContext } from "../../context/StoreContext";

const LoginPopup = ({ setShowLogin }) => {
  const { setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Đăng nhập");
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errMsg) setErrMsg("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMsg("");

    try {
      const isLogin = currState === "Đăng nhập";
      const path = isLogin ? "/api/user/login" : "/api/user/register";

      // Gửi payload phù hợp
      const payload = isLogin
        ? { email: data.email, password: data.password }
        : { name: data.name, email: data.email, password: data.password };

      const res = await api.post(path, payload);

      if (res.data?.success) {
        const token = res.data.token;
        if (token) {
          localStorage.setItem("token", token);
          setToken?.(token); // ✅ cập nhật Context ngay
        }
        setShowLogin?.(false);
      } else {
        setErrMsg(res.data?.message || "Thao tác thất bại, vui lòng thử lại.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Đã có lỗi xảy ra. Vui lòng thử lại.";
      setErrMsg(msg);
      // eslint-disable-next-line no-console
      console.error("Auth error:", err?.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin?.(false)}
            src={assets?.cross_icon || ""}
            alt="Đóng"
          />
        </div>

        {errMsg && <div className="error-message">{errMsg}</div>}

        <div className="login-popup-inputs">
          {currState === "Đăng ký" && (
            <input
              name="name"
              onChange={onChangeHandle}
              value={data.name}
              type="text"
              placeholder="Tên của bạn"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandle}
            value={data.email}
            type="email"
            placeholder="Email của bạn"
            required
          />
          <input
            name="password"
            onChange={onChangeHandle}
            value={data.password}
            type="password"
            placeholder="Mật khẩu"
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading
            ? "Đang xử lý..."
            : currState === "Đăng ký"
            ? "Tạo tài khoản"
            : "Đăng nhập"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>
            Bằng việc tiếp tục, bạn đồng ý với các Điều khoản và Điều kiện của
            chúng tôi.
          </p>
        </div>

        {currState === "Đăng nhập" ? (
          <p>
            Tạo tài khoản mới?{" "}
            <span onClick={() => setCurrState("Đăng ký")}>Nhấn vào đây</span>
          </p>
        ) : (
          <p>
            Đã có tài khoản?{" "}
            <span onClick={() => setCurrState("Đăng nhập")}>Nhấn vào đây</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
