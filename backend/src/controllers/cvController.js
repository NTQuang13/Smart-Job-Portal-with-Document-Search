import { v4 as uuidv4 } from "uuid";
import pool from "../libs/db.js";
import { cvQueue } from "../libs/queue.js";

// 1. UPLOAD CV
export const uploadCV = async (req, res) => {
  try {
    // req.file được sinh ra bởi thư viện Multer
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "File lỗi: Vui lòng tải lên một file" });
    }

    const userId = req.user.id; // Lấy từ verifyToken
    const cvId = uuidv4();
    const { originalname, path, size } = req.file;
    const status = "pending"; // Trạng thái chờ xử lý (Extract Text)

    const sql = `
      INSERT INTO cvs (id, userId, fileName, filePath, fileSize, status) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [cvId, userId, originalname, path, size, status]);

    // Chúng ta truyền cvId và filePath để Worker biết cần đọc file nào
    await cvQueue.add("extract-cv-text", {
      cvId: cvId,
      filePath: path,
    });

    // Chúng ta sẽ làm phần Worker ở bước sau.

    res
      .status(201)
      .json({ cvId, status, message: "Upload CV thành công, đang chờ xử lý" });
  } catch (error) {
    console.error("Lỗi upload CV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 2. LẤY DANH SÁCH CV CỦA USER (Chỉ lấy của người đang đăng nhập)
export const getCVs = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const sql =
      "SELECT * FROM cvs WHERE userId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?";
    const [data] = await pool.query(sql, [userId, limit, offset]);

    res.status(200).json({ data, page, limit });
  } catch (error) {
    console.error("Lỗi lấy danh sách CV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 3. LẤY CHI TIẾT 1 CV
export const getCVById = async (req, res) => {
  try {
    const cvId = req.params.id;
    const userId = req.user.id;

    // Đảm bảo user chỉ xem được CV của chính họ
    const [cvs] = await pool.query(
      "SELECT * FROM cvs WHERE id = ? AND userId = ?",
      [cvId, userId],
    );

    if (cvs.length === 0) {
      return res.status(404).json({ message: "Not found: Không tìm thấy CV" });
    }

    res.status(200).json({ cv: cvs[0] });
  } catch (error) {
    console.error("Lỗi lấy chi tiết CV:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
