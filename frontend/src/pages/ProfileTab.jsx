import React, { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import "./Dashboard.css";
import "./AccountPage.css";

function ProfileTab() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    region: "",
    bankName: "",
    bankNumber: "",
    experience: "",
    languages: "",
    hasCertificate: false,
    certificateName: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const res = await axiosClient.get("/users/me");
      const data = res.data.user || res.data;

      setForm((prev) => ({
        ...prev,
        name: data.name || "",
        phone: data.phone || "",
        gender: data.gender || "",
        region: data.region || "",
      }));
    };
    fetch();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);

      await axiosClient.put("/users/me", form);

      alert("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2>Thông tin tài khoản</h2>

      {/* THÔNG TIN CÁ NHÂN */}
      <div className="section-card">
        <h3>Thông tin cá nhân</h3>

        <div className="grid-2">
          <input
            placeholder="Tên"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            placeholder="Giới tính"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          />
          <input
            placeholder="Khu vực"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
          />
        </div>
      </div>

      {/* THANH TOÁN */}
      <div className="section-card">
        <h3>Thông tin thanh toán</h3>

        <div className="grid-2">
          <input
            placeholder="Ngân hàng"
            value={form.bankName}
            onChange={(e) => setForm({ ...form, bankName: e.target.value })}
          />
          <input
            placeholder="Số tài khoản"
            value={form.bankNumber}
            onChange={(e) => setForm({ ...form, bankNumber: e.target.value })}
          />
        </div>
      </div>

      {/* KINH NGHIỆM */}
      <div className="section-card">
        <h3>Kinh nghiệm</h3>
        <textarea
          className="textarea"
          value={form.experience}
          onChange={(e) =>
            setForm({ ...form, experience: e.target.value })
          }
        />
      </div>

      {/* BUTTON SAVE */}
      <button
        className="btn-save"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Đang lưu..." : "Lưu thông tin"}
      </button>
    </>
  );
}

export default ProfileTab;