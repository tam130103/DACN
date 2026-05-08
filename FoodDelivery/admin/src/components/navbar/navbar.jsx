import React from 'react';
import './navbar.css';
import { assets } from '../../assets/assets';

const Navbar = () => {
  return (
    <nav className="navbar" aria-label="Admin Header">
      <div className="navbar-brand">
        <img className="logo" src={assets.logo} alt="Tomato" />
        <span>Admin Panel</span>
      </div>
      <div className="profile" aria-label="Profile Menu">
        <img src={assets.profile_image} alt="Admin profile" />
      </div>
    </nav>
  );
};

export default Navbar;
