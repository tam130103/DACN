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
            alert('An error occurred while adding the food item.');
        }
    };

    return (
        <div className="add">
            <form className="flex-col" onSubmit={handleSubmit}>
                {/* Upload Image */}
                <div className="add-img-upload flex-col">
                    <p>Upload image</p>
                    <label htmlFor="image">
                        <img
                            src={image ? URL.createObjectURL(image) : assets.upload_area}
                            alt="Upload preview"
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
                    <p>Product name</p>
                    <input
                        type="text"
                        name="name"
                        placeholder="Type here"
                        value={data.name}
                        onChange={onChangeHandler}
                        required
                    />
                </div>

                {/* Product Description */}
                <div className="add-product-description flex-col">
                    <p>Product description</p>
                    <textarea
                        name="description"
                        rows="6"
                        placeholder="Write content here"
                        value={data.description}
                        onChange={onChangeHandler}
                        required
                    ></textarea>
                </div>

                {/* Product Category and Price */}
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product category</p>
                        <select
                            name="category"
                            value={data.category}
                            onChange={onChangeHandler}
                            required
                        >
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Product price</p>
                        <input
                            type="number"
                            name="price"
                            placeholder="Type here"
                            value={data.price}
                            onChange={onChangeHandler}
                            required
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="add-btn">
                    Add
                </button>
            </form>
        </div>
    );
};

export default Add;
