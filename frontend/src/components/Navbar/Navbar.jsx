// src/components/Navbar/Navbar.jsx
import { useCallback, useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import './Navbar.css';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState('home');
    const [scrolled, setScrolled] = useState(false);
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    const location = useLocation();
    const navigate = useNavigate();

    // Menu items memoization
    const menuItems = useMemo(() => [
        { name: 'home', label: 'Trang chủ' },
        { name: 'menu', label: 'Thực đơn' },
        { name: 'mobile-app', label: 'Ứng dụng' },
        { name: 'contact', label: 'Liên hệ' }
    ], []);

    // Section mapping memoization
    const sectionMap = useMemo(() => ({
        menu: "explore-menu",
        "mobile-app": "app-download",
        contact: "footer",
    }), []);

    // Scroll handler with debounce
    useEffect(() => {
        let timeoutId;
        const handleScroll = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setScrolled(window.scrollY > 20);
            }, 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    // Scroll to section handler
    const scrollToSection = useCallback((id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    // Menu click handler
    const handleMenuClick = useCallback((item) => {
        setMenu(item.name);
        if (item.name === "home") {
            if (location.pathname !== "/") {
                navigate("/");
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            const sectionId = sectionMap[item.name];
            if (location.pathname !== "/") {
                navigate("/", { state: { scrollTo: sectionId } });
            } else {
                scrollToSection(sectionId);
            }
        }
    }, [location.pathname, navigate, sectionMap, scrollToSection]);

    // Logout handler
    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    }, [navigate, setToken]);

    return (
        <div className={`navbar${scrolled ? " scrolled" : ""}`}>
            <Link to="/" onClick={() => setMenu('home')} className="navbar-logo">
                <img src={assets?.logo} alt="Logo" className="logo" /> {/* Giữ nguyên "Logo" hoặc đổi thành "Biểu trưng" tùy ý */}
            </Link>

            <nav className="navbar-menu">
                {menuItems.map(({ name, label }) => (
                    <li
                        key={name}
                        className={menu === name ? "active" : ""}
                        onClick={() => handleMenuClick({ name, label })}
                    >
                        {label}
                    </li>
                ))}
            </nav>

            <div className="navbar-right">
                <button className="icon-button" aria-label="Tìm kiếm">
                    <img src={assets?.search_icon} alt="Tìm kiếm" />
                </button>

               <Link to="/cart" className="navbar-search_icon">
                    <img src={assets?.basket_icon} alt="Giỏ hàng" />
                    {getTotalCartAmount?.() > 0 && <div className="dot" />}
                     </Link>
               

                {token ? (
                    <div className="navbar-profile">
                        <img src={assets.profile_icon} alt="Hồ sơ" />
                        <ul className="nav-profile-dropdown">
                            <li onClick={()=>navigate('/myorders')}>
                                <img src={assets.bag_icon} alt="Đơn hàng" />
                                Đơn hàng
                            </li>
                            <hr />
                            <li onClick={handleLogout}>
                                <img src={assets.logout_icon} alt="Đăng xuất" />
                                Đăng xuất
                            </li>
                        </ul>
                    </div>
                ) : (
                    <button 
                        onClick={() => setShowLogin?.(true)}
                        className="login-button"
                    >
                        Đăng nhập
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
