import { Worker } from "bullmq";
import IORedis from "ioredis";
import PDFParser from "pdf2json";
import { v4 as uuidv4 } from "uuid";
import pool from "../libs/db.js";
import "dotenv/config";

const connection = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  {
    maxRetriesPerRequest: null,
  },
);

console.log("👷 Worker xử lý CV đang chạy và chờ việc...");

// --- HÀM PHỤ TRỢ: Trích xuất Text bằng thư viện mới ---
const extractTextFromPDF = (filePath) => {
  return new Promise((resolve, reject) => {
    // Khởi tạo parser. Tham số '1' báo cho thư viện biết ta chỉ cần trích xuất Text thô
    const pdfParser = new PDFParser(null, 1);

    // Lắng nghe sự kiện lỗi
    pdfParser.on("pdfParser_dataError", (errData) =>
      reject(errData.parserError),
    );

    // Lắng nghe sự kiện đọc xong
    pdfParser.on("pdfParser_dataReady", () => {
      // Lấy toàn bộ chữ, thay thế các dấu xuống dòng bằng khoảng trắng cho sạch dữ liệu
      const rawText = pdfParser
        .getRawTextContent()
        .replace(/\r\n/g, " ")
        .trim();
      resolve(rawText);
    });

    // Bắt đầu đọc file
    pdfParser.loadPDF(filePath);
  });
};

// --- LOGIC CHÍNH CỦA WORKER ---
const worker = new Worker(
  "cv-queue",
  async (job) => {
    const { cvId, filePath } = job.data;
    console.log(`[Job ${job.id}] Đang bắt đầu xử lý CV: ${cvId}`);

    try {
      // 1. Dùng hàm mới để đọc PDF
      const extractedText = await extractTextFromPDF(filePath);

      // 2. Lưu chữ trích xuất được vào MySQL
      const extractId = uuidv4();
      const insertSql = `
      INSERT INTO cv_extracted_data (id, cvId, rawText) 
      VALUES (?, ?, ?)
    `;
      await pool.query(insertSql, [extractId, cvId, extractedText]);

      // 3. Cập nhật trạng thái thành 'completed'
      await pool.query("UPDATE cvs SET status = 'completed' WHERE id = ?", [
        cvId,
      ]);

      console.log(
        `[Job ${job.id}] ✅ Đã xử lý xong CV: ${cvId} (Kích thước text: ${extractedText.length} ký tự)`,
      );
    } catch (error) {
      console.error(`[Job ${job.id}] ❌ Lỗi khi xử lý CV ${cvId}:`, error);
      // Nếu rớt, báo lỗi vào DB
      await pool.query("UPDATE cvs SET status = 'failed' WHERE id = ?", [cvId]);
      throw error;
    }
  },
  { connection },
);
