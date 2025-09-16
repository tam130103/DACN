import React, { useContext, useCallback, useMemo, useState } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems = {}, addToCart, removeFromCart } = useContext(StoreContext);

  // Base URL của backend (Render) từ ENV
  const API_BASE = import.meta.env.VITE_API_URL; // vd: https://dacn.onrender.com

  // Tính link ảnh: nếu DB đã lưu full URL thì dùng luôn, còn không thì ghép /images/<filename>
  const imgSrc = useMemo(() => {
    if (!image) return "";
    if (/^https?:\/\//i.test(image)) return image; // đã là URL tuyệt đối
    return `${API_BASE}/images/${image}`;
  }, [image, API_BASE]);

  const [src, setSrc] = useState(imgSrc);

  const handleImgError = () => {
    // Khi ảnh lỗi thì dùng placeholder
    setSrc(assets?.placeholder_img || assets?.food_menu_placeholder || "");
  };

  const handleAddToCart = useCallback(() => addToCart(id), [addToCart, id]);
  const handleRemoveFromCart = useCallback(() => removeFromCart(id), [removeFromCart, id]);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-img"
          src={src}
          onError={handleImgError}
          alt={name || "Food item"}
          loading="lazy"
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
          <p>{name}</p>
          <img src={assets?.rating_starts || ""} alt="Rating" />
        </div>
        <p className="food-item-desc">{description || "No description available."}</p>
        <p className="food-item-price">
          {typeof price === "number" ? `$${price.toFixed(2)}` : "$0.00"}
        </p>
      </div>
    </div>
  );
};

export default FoodItem;
