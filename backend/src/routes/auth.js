import express from "express";
import {
  signup,
  signin,
  signout,
  refreshToken,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refresh", refreshToken);
router.post("/signout", signout);

export default router;
