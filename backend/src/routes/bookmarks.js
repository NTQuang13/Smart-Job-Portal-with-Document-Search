import express from "express";
import {
  saveJob,
  getBookmarks,
  removeBookmark,
} from "../controllers/bookmarkController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

// Tất cả API Bookmarks đều bắt buộc phải đăng nhập
router.use(verifyToken);

router.post("/", saveJob); // Lưu job
router.get("/", getBookmarks); // Xem danh sách đã lưu
router.delete("/:jobId", removeBookmark); // Bỏ lưu job

export default router;
