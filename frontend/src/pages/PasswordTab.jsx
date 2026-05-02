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
      alert("Không khớp");
      return;
    }

    await axiosClient.put("/users/change-password", data);
    alert("OK");
  };

  return (
    <form onSubmit={handleSubmit} className="password-form">
      <input type="password" name="currentPassword" onChange={handleChange} placeholder="Mật khẩu cũ"/>
      <input type="password" name="newPassword" onChange={handleChange} placeholder="Mật khẩu mới"/>
      <input type="password" name="confirmPassword" onChange={handleChange} placeholder="Xác nhận"/>
      <button className="btn-save">Cập nhật</button>
    </form>
  );
}

export default PasswordTab;