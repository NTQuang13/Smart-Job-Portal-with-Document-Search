import React, { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";

function ProfileTab() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("https://via.placeholder.com/150");
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    position: "",
    gender: "Nam",
    birthday: "",
    address: "",
    education: "",
    experience: 0,
    skills: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRes = await axiosClient.get("/users/me");
        const userData = userRes.data.user || userRes.data;
        const userRole = userData.role;
        setRole(userRole);

        // Preview avatar nếu có
        if (userData.avatar) setAvatarPreview(userData.avatar);

        if (userRole === "recruiter") {
          setFormData((prev) => ({
            ...prev,
            full_name: userData.full_name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            position: userData.position || "",
          }));
        } else {
          const res = await axiosClient.get("/candidates/me");
          if (res.data) {
            const data = res.data;
            setFormData((prev) => ({
              ...prev,
              full_name: data.full_name || userData.full_name || "",
              email: data.email || userData.email || "", // ✅ Đã thêm lấy thông tin Email cho Candidate
              phone: data.phone || userData.phone || "",
              gender: data.gender || "Nam",
              birthday: data.birthday ? data.birthday.split("T")[0] : "",
              address: data.address || "",
              education: data.education || "",
              experience: data.experience || 0,
              skills: data.skills || "",
            }));
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải hồ sơ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      // 1. Upload ảnh (nếu đã có API)
      if (selectedFile) {
        const imgData = new FormData();
        imgData.append("avatar", selectedFile);
        // await axiosClient.post("/users/upload-avatar", imgData); 
        // Note: Cần viết backend cho route này mới chạy được
      }

      // 2. Lưu thông tin
      if (role === "recruiter") {
        // Recruiter: Cập nhật vào bảng users
        await axiosClient.put("/users/me", {
          name: formData.full_name,
          phone: formData.phone,
          position: formData.position,
        });
      } else {
        // Candidate: Cập nhật vào bảng candidates (controller mới sẽ lo việc đồng bộ sang users)
        await axiosClient.put("/candidates/me", formData);
      }
      
      alert("Cập nhật hồ sơ thành công! 🎉");
      window.location.reload(); // Reload để cập nhật lại tên trên Topbar
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi cập nhật.");
    }
  };

  if (loading) return <div className="loading-screen">Đang tải dữ liệu...</div>;

  return (
    <div className="fade-in">
      <h2 style={{ marginBottom: "20px" }}>👤 Hồ sơ cá nhân</h2>

      <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px" }}>
        
        {/* CỘT TRÁI: FORM THÔNG TIN */}
        <div className="profile-info-column">
          <div className="section-card">
            <h3 className="section-title">
              {role === "recruiter" ? "Thông tin nhà tuyển dụng" : "Thông tin cơ bản"}
            </h3>
            
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input
                  type="text"
                  name="full_name"
                  className="form-input"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {role === "recruiter" ? (
              <div className="grid-2" style={{ marginTop: "15px" }}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="text" className="form-input" value={formData.email} disabled style={{ backgroundColor: "#f8fafc" }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Chức vụ</label>
                  <input type="text" name="position" className="form-input" value={formData.position} onChange={handleChange} />
                </div>
              </div>
            ) : (
              <>
                <div className="form-group" style={{ marginTop: "15px" }}>
                  <label className="form-label">Email</label>
                  <input type="text" className="form-input" value={formData.email} disabled style={{ backgroundColor: "#f8fafc" }} />
                </div>

                <div className="grid-2" style={{ marginTop: "15px" }}>
                  <div className="form-group">
                    <label className="form-label">Giới tính</label>
                    <select name="gender" className="form-input" value={formData.gender} onChange={handleChange}>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ngày sinh</label>
                    <input type="date" name="birthday" className="form-input" value={formData.birthday} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: "15px" }}>
                  <label className="form-label">Địa chỉ</label>
                  <input type="text" name="address" className="form-input" value={formData.address} onChange={handleChange} />
                </div>
              </>
            )}
          </div>

          {role === "candidate" && (
            <div className="section-card" style={{ marginTop: "20px" }}>
              <h3 className="section-title">Trình độ & Kinh nghiệm</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Học vấn</label>
                  <input type="text" name="education" className="form-input" value={formData.education} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Kinh nghiệm (năm)</label>
                  <input type="number" name="experience" className="form-input" value={formData.experience} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: "15px" }}>
                <label className="form-label">Kỹ năng</label>
                <textarea name="skills" className="textarea" value={formData.skills} onChange={handleChange} rows="4" />
              </div>
            </div>
          )}

          <div style={{ textAlign: "left", marginTop: "20px" }}>
            <button className="btn-save" onClick={handleSave} style={{ padding: "10px 30px" }}>
              Lưu thay đổi
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: AVATAR */}
        <div className="profile-avatar-column">
          <div className="section-card" style={{ textAlign: "center", position: "sticky", top: "20px" }}>
            <h3 className="section-title">Ảnh đại diện</h3>
            <div className="avatar-wrapper" style={{ margin: "20px 0" }}>
              <img 
                src={avatarPreview} 
                alt="Avatar" 
                style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover", border: "3px solid #e2e8f0" }} 
              />
            </div>
            <label className="btn-change-avatar" style={{ cursor: "pointer", display: "inline-block", padding: "8px 16px", backgroundColor: "#f1f5f9", borderRadius: "8px", fontSize: "14px" }}>
              Thay ảnh
              <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </label>
            <p style={{ fontSize: "12px", color: "#64748b", marginTop: "10px" }}>Định dạng: JPG, PNG. Tối đa 2MB</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProfileTab;