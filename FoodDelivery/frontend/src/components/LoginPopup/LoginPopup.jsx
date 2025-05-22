import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext);

    const [currState, setCurrState] = useState("Login");
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
            if (currState === "Login") {
                newUrl += "/api/user/login";
            } else {
                newUrl += "/api/user/register";
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
            alert("An error occurred. Please try again.");
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
                        alt="Close"
                    />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign up" && (
                        <input
                            name="name"
                            onChange={onChangeHandle}
                            value={data.name}
                            type="text"
                            placeholder="Your name"
                            required
                        />
                    )}
                    <input
                        name="email"
                        onChange={onChangeHandle}
                        value={data.email}
                        type="email"
                        placeholder="Your email"
                        required
                    />
                    <input
                        name="password"
                        onChange={onChangeHandle}
                        value={data.password}
                        type="password"
                        placeholder="Password"
                        required
                    />
                </div>
                <button type="submit">
                    {currState === "Sign up" ? "Create account" : "Login"}
                </button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, you agree to our Terms and Conditions.</p>
                </div>
                {currState === "Login" ? (
                    <p>
                        Create new account?{" "}
                        <span onClick={() => setCurrState("Sign up")}>
                            Click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Already have an account?{" "}
                        <span onClick={() => setCurrState("Login")}>
                            Click here
                        </span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;
