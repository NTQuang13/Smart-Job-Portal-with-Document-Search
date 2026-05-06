import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import "react-quill/dist/quill.snow.css";

function JobsTab() {
  const navigate = useNavigate();
  const [ReactQuill, setReactQuill] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  
  const [hasCompany, setHasCompany] = useState(false);
  const [checking, setChecking] = useState(true);

  // Load editor và kiểm tra công ty
  useEffect(() => {
    // 1. Load Quill
    import("react-quill")
      .then((mod) => {
        setReactQuill(() => mod.default);
      })
      .catch((err) => console.error("Quill load error:", err));

    // 2. Kiểm tra thông tin công ty
    const checkCompany = async () => {
      try {
        const res = await axiosClient.get("/companies/me");
        if (res.data && (res.data.company || res.data.id)) {
          setHasCompany(true);
        }
      } catch (err) {
        setHasCompany(false);
      } finally {
        setChecking(false);
      }
    };
    checkCompany();
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header", "bold", "italic", "underline", "color", "background", "list", "bullet", "link", "image",
  ];

  const handleSubmit = async () => {
    if (!title || !content) return alert("Vui lòng nhập đầy đủ tiêu đề và nội dung");
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", content);
    if (file) formData.append("file", file);

    try {
      await axiosClient.post("/jobs", formData);
      alert("Đăng tin tuyển dụng thành công!");
      setTitle("");
      setContent("");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi đăng tin");
    }
  };

  if (checking) return <div className="loading-screen">Đang kiểm tra thông tin...</div>;

  // NẾU CHƯA CÓ CÔNG TY: Hiện giao diện yêu cầu tạo công ty
  if (!hasCompany) {
    return (
      <div className="fade-in" style={{ textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "50px", marginBottom: "20px" }}>🏢</div>
        <h2>Bạn chưa có thông tin công ty</h2>
        <p style={{ color: "#64748b", marginBottom: "20px" }}>
          Vui lòng cập nhật thông tin công ty của bạn trước khi đăng tin tuyển dụng.
        </p>
        <button 
          className="btn-save" 
          onClick={() => navigate("/account/company")}
        >
          Cập nhật thông tin công ty ngay
        </button>
      </div>
    );
  }

  // NẾU ĐÃ CÓ CÔNG TY: Hiện form tạo Job như cũ
  return (
    <div className="fade-in">
      <h2>💼 Đăng tin tuyển dụng mới</h2>

      <div className="section-card">
        <h3>Tiêu đề công việc</h3>
        <input
          type="text"
          placeholder="VD: Frontend Developer React"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="section-card">
        <h3>Mô tả công việc</h3>
        {ReactQuill && (
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            style={{ height: "300px", marginBottom: "50px" }}
          />
        )}
      </div>

      <div className="section-card">
        <h3>Đính kèm file (PDF, DOC...)</h3>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file && (
          <p style={{ marginTop: "10px", color: "#64748b" }}>
            📎 {file.name}
          </p>
        )}
      </div>

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button className="btn-save" onClick={handleSubmit}>
          Đăng bài ngay
        </button>
      </div>
    </div>
  );
}

export default JobsTab;