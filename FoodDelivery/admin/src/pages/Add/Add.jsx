// FoodDelivery/admin/src/pages/Add/Add.jsx
import React, { useState, useRef } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import { api } from "../../api/client";  // chỉ dùng api, bỏ authHeader
import { toast } from "react-toastify";

const Add = () => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "Salad",
    price: "",
  });

  const filePreviewUrl = useRef(null);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setImage(file || null);

    // cleanup preview cũ để tránh leak
    if (filePreviewUrl.current) URL.revokeObjectURL(filePreviewUrl.current);
    if (file) filePreviewUrl.current = URL.createObjectURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Vui lòng chọn ảnh sản phẩm.");
      return;
    }
    const priceNum = Number(data.price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      toast.error("Giá sản phẩm phải lớn hơn 0.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name.trim());
    formData.append("description", data.description.trim());
    formData.append("category", data.category);
    formData.append("price", priceNum);
    formData.append("image", image);

    try {
      const res = await api.post("/api/food/add", formData);

      if (res.data?.success) {
        toast.success(res.data.message || "Đã thêm món ăn!");
        setData({ name: "", description: "", category: "Salad", price: "" });
        setImage(null);
        if (filePreviewUrl.current) {
          URL.revokeObjectURL(filePreviewUrl.current);
          filePreviewUrl.current = null;
        }
      } else {
        toast.error(res.data?.message || "Thêm món ăn thất bại.");
      }
    } catch (err) {
      console.error("Add food error:", err?.response?.data || err.message);
      toast.error(
        err?.response?.data?.message || "Đã xảy ra lỗi khi thêm món ăn."
      );
    }
  };

  const previewSrc =
    image && filePreviewUrl.current
      ? filePreviewUrl.current
      : assets.upload_area;

  return (
    <div className="add">
      <form className="flex-col" onSubmit={handleSubmit}>
        {/* Upload Image */}
        <div className="add-img-upload flex-col">
          <p>Tải ảnh lên</p>
          <label htmlFor="image">
            <img src={previewSrc} alt="Xem trước ảnh tải lên" />
          </label>
          <input type="file" id="image" hidden required onChange={handleFileChange} />
        </div>

        {/* Product Name */}
        <div className="add-product-name flex-col">
          <p>Tên sản phẩm</p>
          <input
            type="text"
            name="name"
            placeholder="Nhập vào đây"
            value={data.name}
            onChange={onChangeHandler}
            required
          />
        </div>

        {/* Product Description */}
        <div className="add-product-description flex-col">
          <p>Mô tả sản phẩm</p>
          <textarea
            name="description"
            rows="6"
            placeholder="Viết nội dung ở đây"
            value={data.description}
            onChange={onChangeHandler}
            required
          ></textarea>
        </div>

        {/* Category + Price */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Danh mục sản phẩm</p>
            <select
              name="category"
              value={data.category}
              onChange={onChangeHandler}
              required
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Gỏi cuốn</option>
              <option value="Deserts">Tráng miệng</option>
              <option value="Sandwich">Bánh mì Sandwich</option>
              <option value="Cake">Bánh ngọt</option>
              <option value="Pure Veg">Món chay</option>
              <option value="Pasta">Mì Ý</option>
              <option value="Noodles">Mì</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Giá sản phẩm</p>
            <input
              type="number"
              name="price"
              placeholder="Nhập vào đây"
              value={data.price}
              onChange={onChangeHandler}
              min="0.01"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="add-btn">
          Thêm
        </button>
      </form>
    </div>
  );
};

export default Add;
