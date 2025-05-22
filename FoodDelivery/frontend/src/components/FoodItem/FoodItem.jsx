import React, { useContext, useCallback } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems = {}, addToCart, removeFromCart, url } = useContext(StoreContext);

  const handleAddToCart = useCallback(() => addToCart(id), [addToCart, id]);
  const handleRemoveFromCart = useCallback(() => removeFromCart(id), [removeFromCart, id]);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-img"
          src={url ? `${url}/images/${image}` : ""}
          alt={name || "Food item"}
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
        <p className="food-item-price">${price?.toFixed(2) || "0.00"}</p>
      </div>
    </div>
  );
};

export default FoodItem;
