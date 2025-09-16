// FoodDelivery/admin/src/pages/List/List.jsx
import React, { useState, useEffect } from "react";
import "./List.css";
import { api } from "../../api/client"; // dùng axios instance
import { toast } from "react-toastify";

const List = () => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const res = await api.get("/api/food/list");
      if (res.data.success) {
        setList(res.data.data);
      } else {
        toast.error(res.data.message || "Lỗi tải dữ liệu");
      }
    } catch (err) {
      console.error("Error fetching list:", err?.response?.data || err.message);
      toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    }
  };

  const deleteItem = async (id) => {
    try {
      const res = await api.post("/api/food/remove", { id });
      if (res.data.success) {
        toast.success("Xóa món ăn thành công");
        fetchList(); // reload danh sách
      } else {
        toast.error(res.data.message || "Không thể xóa món ăn");
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
        <div className="list-table-format title">
          <b>Hình ảnh</b>
          <b>Tên</b>
          <b>Danh mục</b>
          <b>Giá</b>
          <b>Hành động</b>
        </div>

        {list.map((item) => (
          <div key={item._id} className="list-table-format">
            <img src={`${api.defaults.baseURL}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {item.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
            <button onClick={() => deleteItem(item._id)}>Xóa</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
