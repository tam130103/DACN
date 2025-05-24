import React from 'react';
import './navbar.css';
import { assets } from '../../assets/assets';

const Navbar = () => {
  return (
    <div className="navbar">
      <img className="logo" src={assets.logo} alt="Logo Trang Quản Trị" />
      <img className="profile" src={assets.profile_image} alt="Ảnh hồ sơ quản trị viên" />
    </div>
  );
};

export default Navbar;
