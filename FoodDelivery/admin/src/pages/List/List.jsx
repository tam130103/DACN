import React, { useState, useEffect } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({url}) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Lỗi tải dữ liệu');
      }
    } catch (error) {
      console.error('Error fetching list:', error);
      toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id });
      if (response.data.success) {
        toast.success('Xóa món ăn thành công');
        fetchList(); // Cập nhật danh sách sau khi xóa
      } else {
        toast.error('Không thể xóa mục');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Đã xảy ra lỗi khi xóa mục.');
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
        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <img src={`${url}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price.toLocaleString('vi-VN')}</p> {/* Thêm định dạng tiền tệ Việt Nam */}
            <button onClick={() => deleteItem(item._id)}>Xóa</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
