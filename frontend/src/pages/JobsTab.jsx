import React, { useState } from "react";
import axiosClient from "../utils/axiosClient";
import "react-quill/dist/quill.snow.css";

function JobsTab() {
  const [ReactQuill, setReactQuill] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  // load editor an toàn (fix màn đen + React 19 issue)
  React.useEffect(() => {
    import("react-quill")
      .then((mod) => {
        setReactQuill(() => mod.default);
      })
      .catch((err) => console.error("Quill load error:", err));
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
    "header",
    "bold",
    "italic",
    "underline",
    "color",
    "background",
    "list",
    "bullet",
    "link",
    "image",
  ];

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("Vui lòng nhập tiêu đề và nội dung");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (file) formData.append("file", file);

      await axiosClient.post("/jobs/create", formData);

      alert("Đăng job thành công");

      setTitle("");
      setContent("");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Lỗi đăng job");
    }
  };

  // loading editor
  if (!ReactQuill) {
    return <div style={{ padding: "20px" }}>Loading editor...</div>;
  }

  return (
    <div className="fade-in">
      <h2>💼 Đăng bài tuyển dụng</h2>

      {/* ===== TITLE ===== */}
      <div className="section-card">
        <h3>Tiêu đề công việc</h3>
        <input
          type="text"
          placeholder="VD: Frontend Developer React"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* ===== EDITOR ===== */}
      <div className="section-card">
        <h3>Mô tả công việc</h3>

        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          style={{ height: "300px", marginBottom: "50px" }}
        />
      </div>

      {/* ===== FILE UPLOAD ===== */}
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

      {/* ===== PREVIEW ===== */}
      <div className="section-card">
        <h3>Xem trước</h3>
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          style={{
            background: "#fff",
            padding: "10px",
            borderRadius: "8px",
          }}
        />
      </div>

      {/* ===== SUBMIT ===== */}
      <button className="btn-save" onClick={handleSubmit}>
         Đăng bài tuyển dụng
      </button>
    </div>
  );
}

export default JobsTab;