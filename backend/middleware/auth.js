import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Lấy token từ Authorization header (Bearer ...) hoặc header 'token'
    let token =
      req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Không được phép truy cập. Thiếu token.",
      });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Gán userId vào req để controller sử dụng
    req.userId = decoded.id;

    return next();
  } catch (err) {
    console.error("Lỗi xác thực token:", err.message);
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
    });
  }
};

export default authMiddleware;
