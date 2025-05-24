import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {

    // THAY ĐỔI TÊN BIẾN TỪ food_list THÀNH foodList
    const {foodList} = useContext(StoreContext) // <-- Đã sửa ở đây!

    // Thêm kiểm tra điều kiện để tránh lỗi map trên undefined khi dữ liệu chưa tải
    if (!foodList || !Array.isArray(foodList) || foodList.length === 0) {
        return (
            <div className="food-display" id="food-display">
                <h2>Món ngon gần bạn</h2>
                <p>Đang tải món ăn... hoặc không tìm thấy món ăn nào.</p>
                {/* Bạn có thể thêm spinner hoặc thông báo tải ở đây */}
            </div>
        );
    }

  return (
    <div className='food-display' id='food-display'>
      <h2>Món ngon gần bạn</h2>
      <div className="food-display-list">
        {foodList.map((item,index)=>{ // <-- Sử dụng foodList đã sửa
            // Thêm kiểm tra item để đảm bảo item không bị undefined/null
            if (!item) return null;

            if(category==="All" || category===item.category){
                return <FoodItem key={index} id={item._id} name={item.name} price={item.price} description={item.description} image={item.image}/>
            }
            return null; // Return null for items that don't match the category
        })}
      </div>
    </div>
  ) 
}

export default FoodDisplay