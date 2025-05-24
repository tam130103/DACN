import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext);

    const [currState, setCurrState] = useState("Đăng nhập"); // Changed initial state to Vietnamese
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const onChangeHandle = (event) => {
        const { name, value } = event.target;
        if (name && value !== undefined) {
            setData((data) => ({ ...data, [name]: value }));
        }
    };

    const onLogin = async (event) => {
        event.preventDefault();
        try {
            let newUrl = url;
            if (currState === "Đăng nhập") { // Check against Vietnamese state
                newUrl += "/api/user/login";
            } else {
                newUrl += "/api/user/register"; // "Sign up" state will be "Đăng ký"
            }

            const response = await axios.post(newUrl, data);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error during login/register:", error);
            alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    return (
        <div className="login-popup">
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img
                        onClick={() => setShowLogin?.(false)}
                        src={assets?.cross_icon || ""}
                        alt="Đóng"
                    />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Đăng ký" && ( // Check against Vietnamese state
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
                <button type="submit">
                    {currState === "Đăng ký" ? "Tạo tài khoản" : "Đăng nhập"}
                </button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>Bằng việc tiếp tục, bạn đồng ý với các Điều khoản và Điều kiện của chúng tôi.</p>
                </div>
                {currState === "Đăng nhập" ? ( // Check against Vietnamese state
                    <p>
                        Tạo tài khoản mới?{" "}
                        <span onClick={() => setCurrState("Đăng ký")}>
                            Nhấn vào đây
                        </span>
                    </p>
                ) : (
                    <p>
                        Đã có tài khoản?{" "}
                        <span onClick={() => setCurrState("Đăng nhập")}>
                            Nhấn vào đây
                        </span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;
