import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
        <div className="header-contents"> {/* Sửa lỗi chính tả "ur" thành "your" và dịch */}
            <h2>Đặt món ăn yêu thích của bạn tại đây</h2>
             <p>Khám phá vô vàn lựa chọn ẩm thực đa dạng, từ những món ăn truyền thống đến các hương vị hiện đại, tất cả đều được chế biến từ nguyên liệu tươi ngon và giao đến tận nơi cho bạn.</p>
            <button><span>Xem thực đơn</span></button>
        </div>
    </div>
  )
}

export default Header
