import React, { useState } from "react";
import axiosClient from "../utils/axiosClient";
import "./AccountPage.css";

function PasswordTab() {
  const [data, setData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.newPassword !== data.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      await axiosClient.put("/users/change-password", data);
      alert("Đổi mật khẩu thành công! 🎉");
      // Reset form sau khi thành công
      setData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra: " + (err.response?.data?.message || "Vui lòng thử lại"));
    }
  };

  return (
    <div className="fade-in">
      {/* Thêm tiêu đề h2 đồng bộ với các tab khác */}
      <h2>🔒 Đổi mật khẩu</h2>

      <div className="section-card" style={{ maxWidth: "500px" }}>
        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label className="form-label">Mật khẩu hiện tại</label>
            <input 
              type="password" 
              name="currentPassword" 
              value={data.currentPassword}
              onChange={handleChange} 
              placeholder="Nhập mật khẩu cũ"
              required
            />
          </div>

          <div className="form-group" style={{ marginTop: "15px" }}>
            <label className="form-label">Mật khẩu mới</label>
            <input 
              type="password" 
              name="newPassword" 
              value={data.newPassword}
              onChange={handleChange} 
              placeholder="Nhập mật khẩu mới"
              required
            />
          </div>

          <div className="form-group" style={{ marginTop: "15px" }}>
            <label className="form-label">Xác nhận mật khẩu mới</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={data.confirmPassword}
              onChange={handleChange} 
              placeholder="Nhập lại mật khẩu mới"
              required
            />
          </div>

          <div style={{ marginTop: "25px" }}>
            <button type="submit" className="btn-save">
              Cập nhật mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordTab;