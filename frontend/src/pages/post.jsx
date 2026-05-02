import { useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";

function PostJob() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    if (!title || !description) {
      alert("Vui lòng nhập đầy đủ");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("file", file);

    try {
      await axiosClient.post("/jobs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Đăng bài thành công!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Lỗi đăng bài");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Đăng tuyển dụng</h2>

      <input
        placeholder="Tiêu đề"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Mô tả"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleSubmit}>
        Đăng bài
      </button>
    </div>
  );
}

export default PostJob;