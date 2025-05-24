import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'
const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'> {/* Bạn có thể thay đổi id nếu cần thiết cho mục đích cuộn trang */}
      <p>Để có trải nghiệm tốt hơn<br/>Tải ứng dụng Tomato ngay!</p>
        <div className="app-download-platform">
            <img src={assets.play_store} alt="Tải về từ Google Play" />
            <img src={assets.app_store} alt="Tải về từ App Store" />
        </div>
    </div>
  )
}

export default AppDownload
