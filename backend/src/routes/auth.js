import express from "express";
import {
  signup,
  signin,
  signout,
  requestRefreshToken,
} from "../controllers/authController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refresh-token", requestRefreshToken);
router.post("/signout", verifyToken, signout);

export default router;
