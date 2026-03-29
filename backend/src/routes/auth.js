import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import verifyToken from "../middlewares/auth.js";
import pool from "../libs/db.js";

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret_key";

// POST /auth/singup
router.post("/signup", async (req, res) => {
  try {
    // Nhận đủ 4 trường theo tài liệu
    const { name, email, password, role } = req.body;

    // Validation input cơ bản
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    // Kiểm tra "Email tồn tại"
    const [existingUsers] = await pool.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email tồn tại" });
    }

    // Kiểm tra role hợp lệ
    const validRoles = ["candidate", "recruiter"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        message:
          "Role không hợp lệ. Chỉ chấp nhận 'candidate' hoặc 'recruiter'",
      });
    }
    const userRole = role || "candidate";

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await pool.query(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [userId, name, email, hashedPassword, userRole],
    );

    // JWT auth - Tạo token
    const token = jwt.sign({ id: userId, email, role: userRole }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // Output: { user, token }
    res.status(201).json({
      user: { id: userId, name, email, role: userRole },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /auth/signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation input
    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu email hoặc password" });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // Xử lý lỗi "Sai email/password"
    if (users.length === 0) {
      return res.status(401).json({ message: "Sai email/password" });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Sai email/password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "365d" },
    );

    // Output: { token }
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /auth/signout
router.post("/signout", verifyToken, (req, res) => {
  try {
    // Với cấu trúc JWT hiện tại, Server chỉ cần phản hồi thành công.
    // Việc xoá Token sẽ do Frontend/Client tự xử lý.
    res.status(200).json({
      message: "Đăng xuất thành công. Vui lòng xoá token ở phía Client.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
