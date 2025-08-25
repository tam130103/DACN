import React from 'react'
import './Orders.css'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { assets} from '../../assets/assets.js'

const Orders = ({url}) => {

const [orders,setOrders] = useState([]);

const fetchAllOrders = async () => {
  const response = await axios.get(url+"/api/order/list");
  if (response.data.success) {
    setOrders(response.data.data);
    console.log(response.data.data);
  }
  else{
    toast.error("Lỗi")
  }
}

const statusHandler = async (event,orderId) => {
  const response = await axios.post(url+"/api/order/status",{
    orderId,
    status:event.target.value
  })
  if (response.data.success) {
    await fetchAllOrders();
  }
}

useEffect(()=>{
  fetchAllOrders();
},[])

  return (
    <div className='order add'>
      <h3>Trang đơn hàng</h3>
      <div className="order-list">
        {orders.map((order,index)=>(
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="Biểu tượng gói hàng" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item,index)=>{
                  if (index===order.items.length-1) {
                    return item.name + " x " + item.quantity
                  }
                  else{
                    return item.name + " x " + item.quantity + ", "
                  }
                })}
              </p>
              <p className="order-item-name">{order.address.firstName+" "+order.address.lastName}</p>
              <div className='order-item-address'>
                <p>{order.address.street+","}</p>
                <p>{order.address.city+", "+order.address.state+", "+order.address.country+", "+order.address.postalCode}</p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Số món: {order.items.length}</p>
            <p>${order.amount}</p>
            <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
              <option value="Đang xử lý món">Đang xử lý món</option>
              <option value="Đang giao hàng">Đang giao hàng</option>
              <option value="Đã giao">Đã giao</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
