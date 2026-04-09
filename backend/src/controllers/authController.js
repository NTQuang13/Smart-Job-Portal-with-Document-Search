import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import pool from "../libs/db.js";

const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret_key";
const REFRESH_SECRET_KEY =
  process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret_key";

// --- HÀM PHỤ TRỢ: Tạo bộ đôi Token ---
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: "15m" }, // Access Token sống ngắn (15 phút)
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    REFRESH_SECRET_KEY,
    { expiresIn: "7d" }, // Refresh Token sống dài (7 ngày)
  );

  return { accessToken, refreshToken };
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const validRoles = ["candidate", "recruiter"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: "Role không hợp lệ" });
    }

    const [existingUsers] = await pool.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const userRole = role || "candidate";

    await pool.query(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [userId, name, email, hashedPassword, userRole],
    );

    const userPayload = { id: userId, email, role: userRole };
    const tokens = generateTokens(userPayload);

    res.status(201).json({
      user: { id: userId, name, email, role: userRole },
      ...tokens,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu email hoặc password" });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(401).json({ message: "Sai email/password" });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Sai email/password" });
    }

    const userPayload = { id: user.id, email: user.email, role: user.role };
    const tokens = generateTokens(userPayload);

    res.json({ ...tokens });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// REFRESH TOKEN (Cấp lại Access Token mới)
export const requestRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Không tìm thấy Refresh Token" });
    }

    // Xác thực Refresh Token
    jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message:
            "Refresh Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
        });
      }

      // Nếu hợp lệ, cấp phát Access Token mới
      const userPayload = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
      const newAccessToken = jwt.sign(userPayload, SECRET_KEY, {
        expiresIn: "15m",
      });

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signout = (req, res) => {
  try {
    // Nếu có lưu refreshToken trong DB, bạn sẽ viết query xóa nó ở đây
    res.status(200).json({
      message: "Đăng xuất thành công. Frontend vui lòng xóa cả 2 token.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
