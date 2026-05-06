import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

function CompanyTab() {
  const [company, setCompany] = useState(null);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // Lấy thông tin công ty hiện tại (nếu có)
  const fetchCompany = async () => {
    try {
      // endpoint "/companies/me" 
      const res = await axiosClient.get("/companies/me"); 
      if (res.data && (res.data.company || res.data)) {
        const compData = res.data.company || res.data;
        setCompany(compData);
        setName(compData.name || "");
        setWebsite(compData.website || "");
        setDescription(compData.description || "");
      }
    } catch (err) {
      console.log("User chưa có công ty hoặc lỗi API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleSave = async () => {
    if (!name) return alert("Vui lòng nhập tên công ty!");
    try {
      if (company) {
        // Cập nhật công ty đã có
        await axiosClient.put(`/companies/${company._id || company.id}`, { name, website, description });
        alert("Cập nhật thông tin công ty thành công!");
      } else {
        // Tạo mới công ty
        await axiosClient.post("/companies", { name, website, description });
        alert("Tạo hồ sơ công ty thành công!");
        fetchCompany(); // Load lại data để lấy thông tin công ty mới
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu thông tin công ty!");
    }
  };

  if (loading) return <div className="loading-screen">Đang tải dữ liệu...</div>;

  return (
    <div className="fade-in">
      <h2>🏢 Hồ sơ Công ty</h2>

      <div className="section-card">
        <h3>Thông tin cơ bản</h3>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#334155" }}>
            Tên công ty *
          </label>
          <input
            type="text"
            placeholder="VD: Tech Innovators"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#334155" }}>
            Website
          </label>
          <input
            type="text"
            placeholder="https://..."
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
          />
        </div>
      </div>

      <div className="section-card">
        <h3>Mô tả công ty</h3>
        <textarea
          className="textarea"
          placeholder="Giới thiệu về lĩnh vực hoạt động, văn hóa công ty..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button
          onClick={handleSave}
          style={{
            padding: "12px 24px",
            backgroundColor: "#4b2bd9",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {company ? "Cập nhật Công ty" : "Tạo Công ty"}
        </button>
      </div>
    </div>
  );
}

export default CompanyTab;