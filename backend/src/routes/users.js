import express from "express";
import { getMe, getUserById } from "../controllers/userController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", protectedRoute, getMe);
router.get("/:id", protectedRoute, getUserById);

export default router;
