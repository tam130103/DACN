import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({url}) => {
    const [image, setImage] = useState(null);
    const [data, setData] = useState({
        name: '',
        description: '',
        category: 'Salad',
        price: '',
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('price', Number(data.price));
        formData.append('image', image);

        try {
            const response = await axios.post(`${url}/api/food/add`, formData);
            if (response.data.success) {
                setData({
                    name: '',
                    description: '',
                    category: 'Salad',
                    price: '',
                });
                setImage(false);
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error adding food item:', error);
            toast.error('Đã xảy ra lỗi khi thêm món ăn.'); // Thay alert bằng toast.error cho nhất quán
        }
    };

    return (
        <div className="add">
            <form className="flex-col" onSubmit={handleSubmit}>
                {/* Upload Image */}
                <div className="add-img-upload flex-col">
                    <p>Tải ảnh lên</p>
                    <label htmlFor="image">
                        <img
                            src={image ? URL.createObjectURL(image) : assets.upload_area}
                            alt="Xem trước ảnh tải lên"
                        />
                    </label>
                    <input
                        type="file"
                        id="image"
                        hidden
                        required
                        onChange={handleFileChange}
                    />
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

                {/* Product Category and Price */}
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
                            required
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="add-btn">
                    Thêm
                </button>
            </form>
        </div>
    );
};

export default Add;
