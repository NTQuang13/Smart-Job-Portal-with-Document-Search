import express from "express";
import {
  applyJob,
  getApplications,
} from "../controllers/applicationController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route Nộp CV
router.post("/", verifyToken, applyJob);

// Route Lấy danh sách
router.get("/", verifyToken, getApplications);

export default router;
