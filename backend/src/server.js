import dotenv from "dotenv";
dotenv.config();
import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import cvRoutes from "./routes/cvs.js";
import jobRoutes from "./routes/jobs.js";
import searchRoutes from "./routes/searchRoutes.js";
import companyRoutes from "./routes/companies.js";
import bookmarkRoutes from "./routes/bookmarks.js";
import applicationRoutes from "./routes/applications.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);

// Gắn các routers vào các endpoint tương ứng
const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cvs", cvRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/applications", applicationRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
