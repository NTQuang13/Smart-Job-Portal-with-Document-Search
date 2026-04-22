import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { isRecruiter } from "../middlewares/roleMiddleware.js";
import {
  createCompany,
  getCompanies,
} from "../controllers/companyController.js"; // Import Đầu bếp

const router = express.Router();

router.post("/", protectedRoute, isRecruiter, createCompany);
router.get("/", getCompanies);

export default router;
