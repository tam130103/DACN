// src/context/StoreContext.jsx

import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000"; // Hoặc lấy từ biến môi trường
  const [token, setToken] = useState("");
  const [foodList, setFoodList] = useState([]); // Đảm bảo luôn khởi tạo là mảng rỗng
  const [foodMap, setFoodMap] = useState({});

  // Hàm fetch danh sách món ăn
  const fetchFoodList = async () => {
    try {
      console.log("StoreContext.jsx: Fetching food list...");
      const response = await axios.get(url + "/api/food/list");
      if (response.data.success) {
        setFoodList(response.data.data); // data.data phải là một mảng
        // Tạo foodMap ngay sau khi có foodList
        const newFoodMap = {};
        response.data.data.forEach(item => {
          newFoodMap[item._id] = item;
        });
        setFoodMap(newFoodMap);
        console.log("StoreContext.jsx: Fetched", response.data.data.length, "food items");
        console.log("StoreContext.jsx: Sample item:", response.data.data[0]);
        console.log("StoreContext.jsx: foodMap updated with items:", Object.keys(newFoodMap).length);
      } else {
        // Đảm bảo foodList được reset về mảng rỗng nếu có lỗi
        setFoodList([]);
        console.error("StoreContext.jsx: Failed to fetch food list:", response.data.message);
      }
    } catch (error) {
      // Đảm bảo foodList được reset về mảng rỗng nếu có lỗi trong quá trình fetch
      setFoodList([]);
      console.error("StoreContext.jsx: Error fetching food list:", error);
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
        await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        console.log("StoreContext.jsx: Item added to cart (backend):", itemId);
      } catch (error) {
        console.error("StoreContext.jsx: Error adding item to cart:", error);
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
        await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        console.log("StoreContext.jsx: Item removed from cart (backend):", itemId);
      } catch (error) {
        console.error("StoreContext.jsx: Error removing item from cart:", error);
        if (error.response) {
            console.error("Backend response data:", error.response.data);
            console.error("Backend response status:", error.response.status);
            console.error("Backend response headers:", error.response.headers);
        }
      }
    }
  };

  // Hàm tải dữ liệu giỏ hàng từ backend khi người dùng đăng nhập
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
      if (response.data.success) {
        setCartItems(response.data.cartData);
        console.log("StoreContext.jsx: Cart data loaded from backend:", response.data.cartData);
      } else {
        console.error("StoreContext.jsx: Failed to load cart data:", response.data.message);
      }
    } catch (error) {
      console.error("StoreContext.jsx: Error loading cart data:", error);
    }
  };

  // Hàm tính tổng tiền giỏ hàng (sẽ được cung cấp dưới tên calculateCartTotal VÀ getTotalCartAmount)
  const calculateCartTotal = () => {
    let totalAmount = 0;
    // Kiểm tra foodMap trước khi sử dụng
    if (Object.keys(foodMap).length === 0) {
      console.warn("StoreContext.jsx: Cannot calculate cart total, foodMap is empty. Waiting for food data.");
      return 0;
    }

    for (const itemId in cartItems) {
      // Đảm bảo item tồn tại trong cartItems và số lượng > 0
      if (cartItems[itemId] > 0) {
        const itemInfo = foodMap[itemId];
        if (itemInfo) { // Kiểm tra xem itemInfo có tồn tại không
          totalAmount += itemInfo.price * cartItems[itemId];
        } else {
          console.warn(`StoreContext.jsx: Item with ID ${itemId} not found in foodMap.`);
        }
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList(); // Fetch danh sách sản phẩm trước
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token")); // Sau đó tải dữ liệu giỏ hàng
      }
    }
    loadData();
  }, []); // Chỉ chạy một lần khi component mount

  // Các biến và hàm được cung cấp cho các component con
  const contextValue = {
    foodList,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    calculateCartTotal, // Cung cấp hàm này
    getTotalCartAmount: calculateCartTotal, // <-- THÊM CÁI NÀY: Cung cấp calculateCartTotal dưới tên getTotalCartAmount
    url,
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