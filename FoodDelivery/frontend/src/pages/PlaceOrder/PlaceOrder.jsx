import React, { useContext, useState, useEffect } from 'react'; // Import useEffect
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const PlaceOrder = () => {
  // Sử dụng foodList từ context
  const { getTotalCartAmount, token, foodList, cartItems, url, setCartItems } = useContext(StoreContext); // <-- Đã sửa

  const navigate = useNavigate(); // Khai báo useNavigate

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: ""
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const validateInputs = () => {
    // Regex được sửa để cho phép 10-15 chữ số, bao gồm cả dấu + ở đầu cho mã quốc gia nếu có.
    if (!/^\+?\d{10,15}$/.test(data.phone)) {
      setError("Số điện thoại phải từ 10 đến 15 chữ số.");
      return false;
    }
    // postalCode không bắt buộc, chỉ kiểm tra nếu có giá trị
    if (data.postalCode && !/^\d{4,10}$/.test(data.postalCode)) {
      setError("Mã bưu chính phải từ 4 đến 10 chữ số.");
      return false;
    }
    setError(""); // Xóa lỗi nếu không có lỗi nào
    return true;
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    let orderItems = [];

    // KIỂM TRA foodList TRƯỚC KHI LẶP
    if (!foodList || !Array.isArray(foodList) || foodList.length === 0) {
      console.error("PlaceOrder.jsx: foodList is not available or empty when placing order.");
      setError("Dữ liệu món ăn chưa tải xong. Vui lòng thử lại.");
      setIsLoading(false);
      return; // Dừng hàm nếu foodList không hợp lệ
    }

    // Vòng lặp bây giờ sẽ an toàn với foodList
    foodList.forEach((item) => {
      const quantity = cartItems[item._id];
      if (quantity > 0) {
        orderItems.push({
          itemId: item._id,
          name: item.name,
          price: item.price,
          quantity: quantity,
          description: item.description || "Mô tả sản phẩm không có",
        });
      }
    });

    // Kiểm tra nếu giỏ hàng rỗng sau khi lọc
    if (orderItems.length === 0) {
      setError("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm.");
      setIsLoading(false);
      return;
    }

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2 // Giả định phí giao hàng là 2
    };

    console.log("Dữ liệu đơn hàng gửi đi từ frontend:", JSON.stringify(orderData, null, 2));
    console.log("Token được gửi:", token);

    try {
      let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
        setCartItems({}); // Xóa giỏ hàng sau khi đặt hàng thành công
      } else {
        setError(response.data.message || "Không thể đặt hàng. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi khi đặt hàng:", err);
      setError(err.response?.data?.message || "Đã xảy ra lỗi khi đặt hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect để kiểm tra giỏ hàng rỗng và chuyển hướng
  useEffect(() => {
    // Chỉ chuyển hướng nếu getTotalCartAmount() là 0 VÀ foodList đã được tải
    // (kiểm tra foodList.length > 0 để đảm bảo fetch đã hoàn tất)
    // Nếu bạn muốn giỏ hàng rỗng ngay từ đầu đã chuyển hướng, bạn có thể bỏ foodList.length > 0
    if (foodList && foodList.length > 0 && getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [getTotalCartAmount, navigate, foodList]); // Thêm foodList vào dependency array

  const deliveryFee = 2;
  // totalAmount chỉ tính khi subtotal không phải 0 để tránh hiển thị phí giao hàng khi giỏ trống
  const currentSubtotal = getTotalCartAmount();
  const displayDeliveryFee = currentSubtotal > 0 ? deliveryFee : 0;
  const displayTotalAmount = currentSubtotal > 0 ? currentSubtotal + deliveryFee : 0;


  return (
    <form onSubmit={placeOrder} className="place-order">
      {error && <div className="error-message">{error}</div>}
      <div className="place-order-left">
        <p className="title">Thông tin giao hàng</p>
        <div className="muti-fields"> {/* Đã sửa chính tả: multi-fields */}
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='Tên' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Họ' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Địa chỉ email' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Đường/Phố' />
        <div className="muti-fields"> {/* Đã sửa chính tả: multi-fields */}
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='Thành phố' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='Tỉnh/Bang' />
        </div>
        <div className="muti-fields"> {/* Đã sửa chính tả: multi-fields */}
          <input name='postalCode' onChange={onChangeHandler} value={data.postalCode} type="text" placeholder='Mã bưu chính' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Quốc gia' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Số điện thoại' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Tổng cộng giỏ hàng</h2>
          <div>
            <div className="cart-total-details">
              <p>Tạm tính</p>
              <p>${currentSubtotal.toFixed(2)}</p> {/* Sử dụng currentSubtotal */}
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí vận chuyển</p>
              <p>${displayDeliveryFee.toFixed(2)}</p> {/* Sử dụng displayDeliveryFee */}
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Tổng thanh toán</p>
              <p>${displayTotalAmount.toFixed(2)}</p> {/* Sử dụng displayTotalAmount */}
            </div>
          </div>
          <button
            type="submit"
            className={`payment-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || currentSubtotal === 0} // Disabled nếu giỏ hàng rỗng
          >
            {isLoading ? 'Đang xử lý...' : 'Thanh toán'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;