import React from 'react';
import './sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Add Items */}
      <NavLink
        to="/Add"
        className="sidebar-option"
        activeClassName="active"
      >
        <img src={assets.add_icon} alt="Biểu tượng thêm" />
        <p>Thêm mục</p>
      </NavLink>

      {/* List Items */}
      <NavLink
        to="/List"
        className="sidebar-option"
        activeClassName="active"
      >
        <img src={assets.order_icon} alt="Biểu tượng danh sách" />
        <p>Danh sách mục</p>
      </NavLink>

      {/* Orders */}
      <NavLink
        to="/Orders"
        className="sidebar-option"
        activeClassName="active"
      >
        <img src={assets.order_icon} alt="Biểu tượng đơn hàng" />
        <p>Đơn hàng</p>
      </NavLink>
    </div>
  );
};

export default Sidebar;
