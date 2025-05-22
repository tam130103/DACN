import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    // 1. Lấy token từ header: Ưu tiên 'Authorization' header theo chuẩn Bearer,
    //    nếu không có thì thử lấy từ header 'token' (cách bạn đang dùng).
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7); // Loại bỏ 'Bearer ' để lấy token thật
    } else {
        token = req.headers.token; // Fallback nếu client chỉ gửi header 'token'
    }

    if (!token) {
        // Đã sửa lỗi chính tả 'succsess'
        return res.json({ success: false, message: "Không được phép truy cập. Không tìm thấy token." });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // 2. Gán userId trực tiếp vào đối tượng req
        // Điều này là tốt hơn vì req.body dành cho dữ liệu request payload
        req.userId = token_decode.id; 
        
        next(); // Chuyển quyền điều khiển cho hàm xử lý tiếp theo
    } catch (error) {
        console.error("Lỗi xác thực token:", error); // Sử dụng console.error cho lỗi
        res.json({
            success: false,
            message: "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
        });
    }
};

export default authMiddleware;