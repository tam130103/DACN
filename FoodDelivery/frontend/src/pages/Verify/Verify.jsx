// src/pages/Verify/Verify.jsx
import React, { useContext, useEffect, useState } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { api } from "../../api/client";

const Verify = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { token, setCartItems } = useContext(StoreContext);

  const [msg, setMsg] = useState("Đang xác thực thanh toán...");

  useEffect(() => {
    const run = async () => {
      const success = params.get("success") === "true";
      const orderId = params.get("orderId");

      if (!orderId) {
        setMsg("Thiếu orderId. Quay về trang chủ...");
        setTimeout(() => navigate("/"), 1200);
        return;
      }

      try {
        // Nếu backend dùng Bearer thì đổi headers bên dưới cho khớp:
        // { headers: { Authorization: `Bearer ${token}` } }
        const res = await api.post(
          "/api/order/verify",
          { success, orderId },
          { headers: { token } }
        );

        if (res.data?.success) {
          if (success) {
            setMsg("Thanh toán thành công! Đang mở danh sách đơn hàng...");
            setCartItems?.({});
            setTimeout(() => navigate("/myorders"), 800);
          } else {
            setMsg("Thanh toán đã bị hủy. Quay về giỏ hàng...");
            setTimeout(() => navigate("/cart"), 800);
          }
        } else {
          setMsg(res.data?.message || "Xác thực thất bại. Quay về trang chủ...");
          setTimeout(() => navigate("/"), 1200);
        }
      } catch (e) {
        console.error("Verify error:", e?.response?.data || e.message);
        setMsg("Lỗi xác thực. Quay về trang chủ...");
        setTimeout(() => navigate("/"), 1200);
      }
    };

    run();
  }, [params, token, navigate, setCartItems]);

  return (
    <div className="verify">
      <div className="spinner" />
      <p style={{ marginTop: 16, textAlign: "center" }}>{msg}</p>
    </div>
  );
};

export default Verify;
