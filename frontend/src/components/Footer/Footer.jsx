import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="Logo Công ty" />
                <p>Chúng tôi tận tâm mang đến những bữa ăn ngon nhất, được chế biến từ nguyên liệu tươi sạch và giao đến tận cửa nhà bạn. Sứ mệnh của chúng tôi là làm cho mỗi bữa ăn của bạn trở nên đặc biệt.</p>
                <div className="footer-social-icon">
                    <img src={assets.facebook_icon} alt="Facebook" />
                    <img src={assets.twitter_icon} alt="Twitter" />
                    <img src={assets.linkedin_icon} alt="LinkedIn" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>CÔNG TY</h2>
                <ul>
                    <li>Trang chủ</li>
                    <li>Về chúng tôi</li>
                    <li>Giao hàng</li>
                    <li>Chính sách bảo mật</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>LIÊN HỆ</h2>
                <ul>
                    <li>123456789</li>
                    <li>thetam2103@gmail.com</li>
                </ul>
            </div>
        </div>
        <hr />
        <p className="footer-copyright">Bản quyền © 2025 tam.com - Đã đăng ký Bản quyền.</p>
    </div>
  )
}

export default Footer
