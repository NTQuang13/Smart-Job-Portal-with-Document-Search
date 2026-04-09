import express from "express";
import multer from "multer";
import { uploadCV, getCVs, getCVById } from "../controllers/cvController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

// Cấu hình Multer: Lưu file vào thư mục 'uploads/' ở thư mục gốc
const upload = multer({ dest: "uploads/" });

// API Upload file: Dùng 'upload.single("file")' để hứng 1 file từ field có tên là 'file'
router.post("/upload", verifyToken, upload.single("file"), uploadCV);

router.get("/", verifyToken, getCVs);
router.get("/:id", verifyToken, getCVById);

export default router;
