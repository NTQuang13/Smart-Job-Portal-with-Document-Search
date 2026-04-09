import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import companyRoutes from "./routes/companies.js";
import jobRoutes from "./routes/jobs.js";
import cvRoutes from "./routes/cvs.js";
import applicationRoutes from "./routes/applications.js";
import bookmarksRoutes from "./routes/bookmarks.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Gắn các routers vào các endpoint tương ứng
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/cvs", cvRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/bookmarks", bookmarksRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
