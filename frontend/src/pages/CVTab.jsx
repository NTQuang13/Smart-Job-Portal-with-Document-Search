import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

function CVTab() {
  const [cv, setCv] = useState(null);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== LOAD DATA =====
  const fetchCV = async () => {
    try {
      const res = await axiosClient.get("/cv/me");
      setCv(res.data.cv);
      setDescription(res.data.description || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCV();
  }, []);

  // ===== UPLOAD CV =====
  const handleUpload = async () => {
    if (!file) return alert("Chọn file trước");

    const formData = new FormData();
    formData.append("cv", file);

    try {
      await axiosClient.post("/cv/upload", formData);
      alert("Upload thành công");
      fetchCV();
    } catch (err) {
      console.error(err);
      alert("Upload thất bại");
    }
  };

  // ===== SAVE DESCRIPTION =====
  const handleSaveDescription = async () => {
    try {
      await axiosClient.put("/cv/description", { description });
      alert("Đã lưu mô tả");
    } catch (err) {
      console.error(err);
    }
  };

  // ===== DELETE CV =====
  const handleDelete = async () => {
    if (!window.confirm("Xoá CV?")) return;

    try {
      await axiosClient.delete("/cv");
      setCv(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-screen">Đang tải...</div>;

  return (
    <div className="fade-in">
      <h2>📄 Quản lý CV</h2>

      {/* ===== UPLOAD SECTION ===== */}
      <div className="section-card">
        <h3>Upload CV</h3>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="btn-save" onClick={handleUpload}>
          Upload
        </button>

        {cv && (
          <div style={{ marginTop: "15px" }}>
            <p>
              <b>CV hiện tại:</b>{" "}
              <a href={cv.url} target="_blank" rel="noreferrer">
                Xem CV
              </a>
            </p>

            <button
              className="btn-change-avatar"
              style={{ color: "red" }}
              onClick={handleDelete}
            >
              🗑 Xoá CV
            </button>
          </div>
        )}
      </div>

      {/* ===== DESCRIPTION SECTION ===== */}
      <div className="section-card">
        <h3>Mô tả bản thân</h3>

        <textarea
          className="textarea"
          placeholder="Giới thiệu bản thân, kỹ năng, kinh nghiệm..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="btn-save" onClick={handleSaveDescription}>
          Lưu mô tả
        </button>
      </div>
    </div>
  );
}

export default CVTab;