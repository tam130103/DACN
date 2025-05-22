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
        <img src={assets.add_icon} alt="Add Icon" />
        <p>Add items</p>
      </NavLink>

      {/* List Items */}
      <NavLink
        to="/List"
        className="sidebar-option"
        activeClassName="active"
      >
        <img src={assets.order_icon} alt="List Icon" />
        <p>List items</p>
      </NavLink>

      {/* Orders */}
      <NavLink
        to="/Orders"
        className="sidebar-option"
        activeClassName="active"
      >
        <img src={assets.order_icon} alt="Order Icon" />
        <p>Orders</p>
      </NavLink>
    </div>
  );
};

export default Sidebar;
