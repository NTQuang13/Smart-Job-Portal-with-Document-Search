import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function AccountModal({ user, activeTab, setActiveTab, onClose }) {
  const navigate = useNavigate();

  // Dùng useRef để tham chiếu đến thẻ input file ẩn
  const cvInputRef = useRef(null);
  const jobFileInputRef = useRef(null);

  // State để hiển thị form đăng bài tuyển dụng cho nhà tuyển dụng
  const [showJobForm, setShowJobForm] = useState(false);

  // State quản lý dữ liệu đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // --- HÀM XỬ LÝ ĐỔI MẬT KHẨU ---
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
    console.log("Dữ liệu đổi mật khẩu:", passwordData);
    alert("Đổi mật khẩu thành công (giả lập)!");
    // Reset form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // --- HÀM XỬ LÝ CV ---
  const handleCvClick = () => {
    if (!user || !user.name) {
      alert("Vui lòng đăng nhập hoặc đăng ký để tải CV lên!");
      localStorage.removeItem("accessToken");
      navigate("/", { state: { isSignUp: true } });
      setTimeout(() => {
        onClose();
      }, 100);
      return;
    }
    cvInputRef.current.click();
  };

  const handleCvFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Đã chọn file CV:", file.name);
      alert(`Đã chọn CV: ${file.name}`);
    }
  };

  // --- HÀM XỬ LÝ ĐĂNG BÀI ---
  const handleRecruiterClick = () => {
    if (!user || !user.name) {
      localStorage.removeItem("accessToken");
      navigate("/");
      setTimeout(() => {
        onClose();
      }, 100);
      return;
    }
    setShowJobForm(true);
  };

  const handleJobFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Đã chọn file thông tin tuyển dụng:", file.name);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="account-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>
          &times;
        </button>

        {/* CỘT TRÁI: Menu Sidebar */}
        <div className="account-sidebar">
          <h3 className="account-sidebar-title">Cài đặt tài khoản</h3>
          <ul className="account-menu">
            <li
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              Hồ sơ của bạn
            </li>

            {user?.role === "recruiter" ? (
              <li
                className={activeTab === "my-jobs" ? "active" : ""}
                onClick={() => setActiveTab("my-jobs")}
              >
                Bài tuyển dụng
              </li>
            ) : (
              <li
                className={activeTab === "my-cv" ? "active" : ""}
                onClick={() => setActiveTab("my-cv")}
              >
                Hồ sơ (CV)
              </li>
            )}

            <li
              className={activeTab === "notifications" ? "active" : ""}
              onClick={() => setActiveTab("notifications")}
            >
              Cài đặt thông báo
            </li>
            <li
              className={activeTab === "password" ? "active" : ""}
              onClick={() => setActiveTab("password")}
            >
              Đổi mật khẩu
            </li>
          </ul>
        </div>

        {/* CỘT PHẢI: Nội dung chi tiết */}
        <div className="account-content">
          {/* TAB: PROFILE */}
          {activeTab === "profile" && (
            <>
              <div className="account-content-header">
                <h2>Hồ sơ của bạn</h2>
                <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
              </div>
              <div className="account-content-body">
                <div className="account-form">
                  <div className="form-group">
                    <label>Tên hiển thị</label>
                    <input type="text" defaultValue={user?.name || ""} />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input type="text" placeholder="Chưa cập nhật" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" defaultValue={user?.email || ""} readOnly />
                  </div>
                  <button className="btn-save-account">Lưu</button>
                </div>
                <div className="account-avatar-section">
                  <div className="avatar-preview">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <button className="btn-choose-img">Chọn ảnh</button>
                  <p className="avatar-hint">
                    Dung lượng file tối đa 1 MB
                    <br />
                    Định dạng: .JPEG, .PNG
                  </p>
                </div>
              </div>
            </>
          )}

          {/* TAB: BÀI TUYỂN DỤNG (Recruiter) */}
          {activeTab === "my-jobs" && user?.role === "recruiter" && (
            <div className="account-content-header">
              <h2>Quản lý bài đăng</h2>
              {!showJobForm ? (
                <>
                  <p>Xem và chỉnh sửa các bài tuyển dụng bạn đã đăng.</p>
                  <div style={styles.emptyContainer}>
                    <p style={styles.emptyText}>Bạn chưa có bài đăng nào.</p>
                    <button
                      className="btn-save-account"
                      style={styles.newJobBtn}
                      onClick={handleRecruiterClick}
                    >
                      + Đăng tin mới
                    </button>
                  </div>
                </>
              ) : (
                <div className="account-form" style={styles.formContainer}>
                  <div className="form-group">
                    <label>Tiêu đề tuyển dụng</label>
                    <input type="text" placeholder="VD: Frontend Developer (ReactJS)" />
                  </div>
                  <div className="form-group">
                    <label>Nội dung chi tiết</label>
                    <textarea
                      rows="4"
                      placeholder="Mô tả công việc, yêu cầu..."
                      style={styles.textarea}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>File đính kèm (Thông tin chi tiết - PDF/Word)</label>
                    <input
                      type="file"
                      ref={jobFileInputRef}
                      onChange={handleJobFileChange}
                      accept=".pdf,.doc,.docx"
                      style={styles.hiddenInput}
                    />
                    <button
                      type="button"
                      className="btn-choose-img"
                      onClick={() => jobFileInputRef.current.click()}
                      style={styles.attachFileBtn}
                    >
                      Chọn File Đính Kèm
                    </button>
                  </div>
                  <div style={styles.buttonGroup}>
                    <button className="btn-save-account" style={{ margin: 0 }}>
                      Đăng Bài
                    </button>
                    <button
                      type="button"
                      className="btn-save-account"
                      style={{ backgroundColor: "#ef4444", margin: 0 }}
                      onClick={() => setShowJobForm(false)}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: HỒ SƠ CV (Ứng Viên) */}
          {activeTab === "my-cv" && user?.role !== "recruiter" && (
            <div className="account-content-header">
              <h2>Hồ sơ xin việc (CV)</h2>
              <p>Tải lên CV của bạn để nhà tuyển dụng dễ dàng liên hệ.</p>
              <div style={styles.cvContainer}>
                <div style={styles.cvIcon}>📄</div>
                <p style={styles.cvText}>Tải lên CV của bạn (PDF)</p>
                <input
                  type="file"
                  ref={cvInputRef}
                  onChange={handleCvFileChange}
                  accept=".pdf"
                  style={styles.hiddenInput}
                />
                <button
                  className="btn-choose-img"
                  style={styles.cvBtn}
                  onClick={handleCvClick}
                >
                  Chọn File CV
                </button>
              </div>
            </div>
          )}

          {/* TAB: THÔNG BÁO */}
          {activeTab === "notifications" && (
            <div className="account-content-header">
              <h2>Cài đặt thông báo</h2>
              <p>Tính năng đang được phát triển...</p>
            </div>
          )}

          {/* TAB: MẬT KHẨU */}
          {activeTab === "password" && (
            <div className="account-content-header">
              <h2>Đổi mật khẩu</h2>
              <p>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
              <form
                className="account-form"
                style={{ marginTop: "20px" }}
                onSubmit={handleSubmitPassword}
              >
                <div className="form-group">
                  <label>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu mới"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                </div>
                <div style={styles.buttonGroup}>
                  <button type="submit" className="btn-save-account" style={{ margin: 0 }}>
                    Xác nhận đổi
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- STYLE ---
const styles = {
  emptyContainer: {
    marginTop: "20px",
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "8px",
    border: "1px dashed #cbd5e1",
    textAlign: "center",
  },
  emptyText: {
    color: "#64748b",
    marginBottom: "15px",
  },
  newJobBtn: {
    margin: "0",
  },
  formContainer: {
    marginTop: "20px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    fontFamily: "inherit",
    resize: "vertical",
  },
  hiddenInput: {
    display: "none",
  },
  attachFileBtn: {
    marginTop: "5px",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "15px",
    alignItems: "center",
    justifyContent: "center",
  },
  cvContainer: {
    marginTop: "20px",
    padding: "30px",
    background: "#f8fafc",
    borderRadius: "8px",
    border: "1px dashed #cbd5e1",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  cvIcon: {
    fontSize: "40px",
  },
  cvText: {
    color: "#475569",
    margin: 0,
    fontWeight: "500",
  },
  cvBtn: {
    marginTop: "10px",
  },
};

export default AccountModal;