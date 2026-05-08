import userModel from "../models/userModels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Hàm tạo token JWT
const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" }); // Token hết hạn sau 3 ngày
};

// Hàm đăng nhập
const loginUser = async (req, res) => {
  const { email, password } = req.body || {};

  try {
    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Tìm người dùng theo email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Tạo token
    const token = createToken(user._id);

    // Trả về thông tin người dùng và token
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email, id: user._id },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Hàm đăng ký
const registerUser = async (req, res) => {
  const { name, email, password } = req.body || {};

  try {
    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Kiểm tra người dùng đã tồn tại
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    // Kiểm tra email hợp lệ
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // Kiểm tra độ mạnh của mật khẩu
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // Tạo token
    const token = createToken(user._id);

    // Trả về thông tin người dùng và token
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { name: user.name, email: user.email, id: user._id },
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { loginUser, registerUser };
