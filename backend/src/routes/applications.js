import express from "express";
import {
  applyJob,
  getApplications,
} from "../controllers/applicationController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route Nộp CV
router.post("/", protectedRoute, applyJob);

// Route Lấy danh sách
router.get("/", protectedRoute, getApplications);

export default router;
