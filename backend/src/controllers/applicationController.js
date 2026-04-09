import { v4 as uuidv4 } from "uuid";
import pool from "../libs/db.js";

// 1. NỘP CV ỨNG TUYỂN
export const applyJob = async (req, res) => {
  try {
    const { jobId, cvId } = req.body;
    const userId = req.user.id; // Lấy từ token của Candidate

    if (!jobId || !cvId) {
      return res.status(400).json({ message: "Thiếu jobId hoặc cvId" });
    }

    // Kiểm tra xem CV này có đúng là của User đang đăng nhập không
    const [cvs] = await pool.query(
      "SELECT id FROM cvs WHERE id = ? AND userId = ?",
      [cvId, userId],
    );
    if (cvs.length === 0) {
      return res
        .status(403)
        .json({
          message:
            "Forbidden: CV không tồn tại hoặc không thuộc quyền sở hữu của bạn",
        });
    }

    // Kiểm tra xem đã apply job này chưa
    const [existing] = await pool.query(
      "SELECT id FROM applications WHERE jobId = ? AND userId = ?",
      [jobId, userId],
    );
    if (existing.length > 0) {
      return res
        .status(400)
        .json({
          message: "Already applied: Bạn đã ứng tuyển vào công việc này rồi",
        });
    }

    const applicationId = uuidv4();
    const sql =
      "INSERT INTO applications (id, jobId, userId, cvId) VALUES (?, ?, ?, ?)";
    await pool.query(sql, [applicationId, jobId, userId, cvId]);

    res.status(201).json({
      message: "Ứng tuyển thành công!",
      application: { id: applicationId, jobId, cvId, status: "pending" },
    });
  } catch (error) {
    console.error("Lỗi ứng tuyển:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 2. LẤY DANH SÁCH ỨNG TUYỂN (Thông minh theo Role)
export const getApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let sql = "";
    let params = [];

    if (role === "candidate") {
      // Ứng viên: Lấy lịch sử các job mình đã nộp
      sql = `
        SELECT a.*, j.title as jobTitle, c.name as companyName 
        FROM applications a
        JOIN jobs j ON a.jobId = j.id
        JOIN companies c ON j.companyId = c.id
        WHERE a.userId = ? 
        ORDER BY a.createdAt DESC LIMIT ? OFFSET ?
      `;
      params = [userId, limit, offset];
    } else if (role === "recruiter") {
      // Nhà tuyển dụng: Lấy danh sách những người đã nộp vào CÁC JOB CỦA MÌNH
      sql = `
        SELECT a.*, u.name as candidateName, u.email as candidateEmail, cv.filePath
        FROM applications a
        JOIN jobs j ON a.jobId = j.id
        JOIN users u ON a.userId = u.id
        JOIN cvs cv ON a.cvId = cv.id
        WHERE j.createdBy = ? 
        ORDER BY a.createdAt DESC LIMIT ? OFFSET ?
      `;
      params = [userId, limit, offset];
    }

    const [data] = await pool.query(sql, params);
    res.status(200).json({ data, page, limit });
  } catch (error) {
    console.error("Lỗi lấy danh sách ứng tuyển:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
