// FoodDelivery/admin/src/pages/List/List.jsx
import React, { useState, useEffect, useMemo } from "react";
import "./List.css";
import { api } from "../../api/client";
import { toast } from "react-toastify";

const PLACEHOLDER =
  "https://via.placeholder.com/80x60?text=No+Image";

const List = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy baseURL từ axios instance (đã cấu hình trong /api/client)
  const API_BASE = useMemo(() => {
    const b = (api.defaults.baseURL || "").replace(/\/+$/, "");
    return b;
  }, []);

  const resolveImage = (image) => {
    const val = (image || "").trim();
    if (!val) return PLACEHOLDER;
    // Nếu là URL tuyệt đối (Cloudinary, S3, v.v.)
    if (/^https?:\/\//i.test(val)) return val;
    // Nếu là filename từ multer "uploads"
    if (API_BASE) return `${API_BASE}/images/${val}`;
    // Không có API_BASE mà chỉ là filename -> không thể load từ backend
    return PLACEHOLDER;
  };

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/food/list");
      if (res.data?.success) {
        setList(Array.isArray(res.data.data) ? res.data.data : []);
      } else {
        toast.error(res.data?.message || "Lỗi tải dữ liệu");
      }
    } catch (err) {
      console.error("Error fetching list:", err?.response?.data || err.message);
      toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!id) return;
    if (!window.confirm("Bạn có chắc muốn xóa món này?")) return;

    try {
      const res = await api.post("/api/food/remove", { id });
      if (res.data?.success) {
        toast.success("Xóa món ăn thành công");
        fetchList(); // reload danh sách
      } else {
        toast.error(res.data?.message || "Không thể xóa món ăn");
      }
    } catch (err) {
      console.error("Error deleting item:", err?.response?.data || err.message);
      toast.error("Đã xảy ra lỗi khi xóa món ăn.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <div className="list-table">
        <div className="list-table-header">
          <div className="list-table-format title">
            <b>Hình ảnh</b>
            <b>Tên</b>
            <b>Danh mục</b>
            <b>Giá</b>
            <b>Hành động</b>
          </div>
          <button className="refresh-btn" onClick={fetchList}>Tải lại</button>
        </div>

        {loading ? (
          <div className="list-empty">Đang tải...</div>
        ) : list.length === 0 ? (
          <div className="list-empty">Chưa có món nào.</div>
        ) : (
          list.map((item) => {
            const priceNum = Number(item.price);
            const priceText = Number.isFinite(priceNum)
              ? priceNum.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
              : "—";

            return (
              <div key={item._id} className="list-table-format">
                <img
                  src={resolveImage(item.image)}
                  alt={item.name || "Food"}
                  onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                />
                <p>{item.name || "—"}</p>
                <p>{item.category || "—"}</p>
                <p>{priceText}</p>
                <button onClick={() => deleteItem(item._id)}>Xóa</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default List;
