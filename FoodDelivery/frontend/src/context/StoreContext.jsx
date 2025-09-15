// src/context/StoreContext.jsx
import { createContext, useEffect, useState } from "react";
import { api } from "../api/client"; // <-- dùng axios instance đã tạo

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [foodMap, setFoodMap] = useState({});

  // Hàm fetch danh sách món ăn
  const fetchFoodList = async () => {
    try {
      console.log("StoreContext.jsx: Fetching food list...");
      const response = await api.get("/api/food/list"); // <-- không còn hardcode url
      if (response.data.success) {
        setFoodList(response.data.data);
        // Tạo foodMap ngay sau khi có foodList
        const newFoodMap = {};
        response.data.data.forEach((item) => {
          newFoodMap[item._id] = item;
        });
        setFoodMap(newFoodMap);
        console.log("✅ Fetched", response.data.data.length, "food items");
      } else {
        setFoodList([]);
        console.error("❌ Failed to fetch food list:", response.data.message);
      }
    } catch (error) {
      setFoodList([]);
      console.error("❌ Error fetching food list:", error);
    }
  };

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const newCartItems = { ...prev };
      newCartItems[itemId] = (newCartItems[itemId] || 0) + 1;
      return newCartItems;
    });
    if (token) {
      try {
        await api.post("/api/cart/add", { itemId }, { headers: { token } });
        console.log("Item added to cart (backend):", itemId);
      } catch (error) {
        console.error("❌ Error adding item to cart:", error);
      }
    }
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCartItems = { ...prev };
      if (newCartItems[itemId] > 0) {
        newCartItems[itemId] -= 1;
      }
      if (newCartItems[itemId] === 0) {
        delete newCartItems[itemId];
      }
      return newCartItems;
    });
    if (token) {
      try {
        await api.post("/api/cart/remove", { itemId }, { headers: { token } });
        console.log("Item removed from cart (backend):", itemId);
      } catch (error) {
        console.error("❌ Error removing item from cart:", error);
        if (error.response) {
          console.error("Backend response:", error.response.data);
        }
      }
    }
  };

  // Hàm tải dữ liệu giỏ hàng từ backend
  const loadCartData = async (token) => {
    try {
      const response = await api.post("/api/cart/get", {}, { headers: { token } });
      if (response.data.success) {
        setCartItems(response.data.cartData);
        console.log("Cart data loaded:", response.data.cartData);
      } else {
        console.error("❌ Failed to load cart data:", response.data.message);
      }
    } catch (error) {
      console.error("❌ Error loading cart data:", error);
    }
  };

  // Tính tổng tiền giỏ hàng
  const calculateCartTotal = () => {
    let totalAmount = 0;
    if (Object.keys(foodMap).length === 0) {
      console.warn("⚠️ Cannot calculate cart total, foodMap is empty.");
      return 0;
    }
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = foodMap[itemId];
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[itemId];
        } else {
          console.warn(`⚠️ Item ${itemId} not found in foodMap.`);
        }
      }
    }
    return totalAmount;
  };

  // Fetch dữ liệu khi app khởi động
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    foodList,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    calculateCartTotal,
    getTotalCartAmount: calculateCartTotal,
    token,
    setToken,
    foodMap,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
