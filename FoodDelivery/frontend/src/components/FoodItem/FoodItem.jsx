import React, { useContext, useCallback, useMemo, useState, useEffect } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems = {}, addToCart, removeFromCart } = useContext(StoreContext);

  // Base URL backend (Render) từ ENV; fallback dev/local
  const API_BASE =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? "http://localhost:4000" : "");

  // Tính link ảnh:
  // - Nếu DB lưu full URL (Cloudinary) -> dùng luôn
  // - Nếu chỉ là filename -> ghép `${API_BASE}/images/<filename>`
  const imgSrc = useMemo(() => {
    const val = (image || "").trim();
    if (!val) return "";
    if (/^https?:\/\//i.test(val)) return val;        // URL tuyệt đối
    if (API_BASE) return `${API_BASE}/images/${val}`;  // ảnh local từ backend
    return ""; // không có API_BASE ở production mà ảnh là filename -> không hiển thị được
  }, [image, API_BASE]);

  const placeholder =
    assets?.placeholder_img || assets?.food_menu_placeholder || "";

  const [src, setSrc] = useState(imgSrc);

  // Sync lại khi props image/API_BASE đổi
  useEffect(() => {
    setSrc(imgSrc || placeholder);
  }, [imgSrc, placeholder]);

  const handleImgError = () => setSrc(placeholder);

  const handleAddToCart = useCallback(() => addToCart(id), [addToCart, id]);
  const handleRemoveFromCart = useCallback(() => removeFromCart(id), [removeFromCart, id]);

  const safeName = (name || "Food item").trim();
  const safeDesc = description || "No description available.";
  const safePrice =
    typeof price === "number" && Number.isFinite(price) ? `$${price.toFixed(2)}` : "$0.00";

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-img"
          src={src}
          onError={handleImgError}
          alt={safeName}
          loading="lazy"
          crossOrigin="anonymous"
        />

        {!cartItems[id] ? (
          <img
            className="add"
            onClick={handleAddToCart}
            src={assets?.add_icon_white || ""}
            alt="Add to cart"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={handleRemoveFromCart}
              src={assets?.remove_icon_red || ""}
              alt="Remove from cart"
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={handleAddToCart}
              src={assets?.add_icon_green || ""}
              alt="Add to cart"
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{safeName}</p>
          <img src={assets?.rating_starts || ""} alt="Rating" />
        </div>
        <p className="food-item-desc">{safeDesc}</p>
        <p className="food-item-price">{safePrice}</p>
      </div>
    </div>
  );
};

export default FoodItem;
