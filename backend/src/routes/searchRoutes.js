import express from "express";
import client from "../libs/elasticsearch.js";

const router = express.Router();

// Helper để xây dựng query
const buildMustConditions = (skill, location) => {
  const must = [];
  if (skill && skill.trim()) must.push({ match: { skills: skill } });
  if (location && location.trim()) must.push({ match: { location: location } });
  return must;
};

// Tìm kiếm ứng viên
router.get("/candidates", async (req, res) => {
  const { skill, location } = req.query;
  const must = buildMustConditions(skill, location);
  if (must.length === 0) return res.json([]);
  try {
    const result = await client.search({
      index: "candidates",
      query: { bool: { must } }
    });
    res.json(result.hits.hits);
  } catch (err) {
    console.error("ES candidates error:", err.meta?.body || err);
    res.status(500).json({ message: "Search error", detail: err.message });
  }
});

// Tìm kiếm công việc
router.get("/jobs", async (req, res) => {
  const { skill, location } = req.query;
  const must = [];
  if (skill && skill.trim()) must.push({ match: { skills_required: skill } });
  if (location && location.trim()) must.push({ match: { location: location } });
  if (must.length === 0) return res.json([]);
  try {
    const result = await client.search({
      index: "jobs",
      query: { bool: { must } }
    });
    res.json(result.hits.hits);
  } catch (err) {
    console.error("ES jobs error:", err.meta?.body || err);
    res.status(500).json({ message: "Search error", detail: err.message });
  }
});

export default router;
