import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
// 🟢 IMPORT cái file bạn vừa tạo (nhớ kiểm tra đúng đường dẫn thư mục utils nhé)
import axiosClient from "../utils/axiosClient";

import "./Dashboard.css";
import logo from "../assets/logo.png";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // State cho thanh tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 🟢 CỰC KỲ GỌN NHẸ: Không cần truyền token vào header nữa!
        // axiosClient sẽ lo hết (cả việc đính kèm token lẫn tự động lấy token mới nếu hết hạn).
        const res = await axiosClient.get("/users/me");
        setUser(res.data.user || res.data);
      } catch (err) {
        console.error("Không thể tải thông tin user:", err);
        // Nếu axiosClient thất bại hoàn toàn (cả Refresh token cũng chết),
        // nó sẽ tự đá user ra trang đăng nhập (đã code trong file utils/axiosClient.js).
      }
    };
    fetchUser();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 🟢 Hàm xử lý đăng xuất an toàn
  const handleLogout = async () => {
    try {
      // Gọi API logout để backend biết (tuỳ chọn nhưng nên có)
      await axiosClient.post("/auth/signout");
    } catch (error) {
      console.log("Lỗi khi báo đăng xuất cho server", error);
    } finally {
      // Dù server báo lỗi hay thành công, thì Frontend vẫn phải xoá CHÌA KHOÁ đi.
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/");
    }
  };

  // Hàm xử lý tìm kiếm
    const handleSearch = () => {
    if (searchKeyword.trim()) {
      navigate(`/jobs?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };
  
    return (
      <div className="container">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-btn" onClick={toggleSidebar}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
  
            <img src={logo} alt="Jobminds Logo" className="logo-img" />
            <h1 className="site-name">
              <span className="textJob">job</span>
              <span className="textMinds">minds</span>
            </h1>
          </div>
  
          <div className="topbar-right">
  
  
            <input
              className="search"
              placeholder="Search job..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
  
            <div className="user-greeting">
              Applied Jobs &nbsp;|&nbsp; Hi, {user?.name || "Người dùng"}
            </div>
  
            <div className="profile-dropdown-container">
              <div 
                className="profileLogo" 
                onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
  
              {isProfilePopupOpen && (
                <div className="profile-popup">
                  <div className="profile-header-small">
                    <div className="avatar popup-avatar">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <h2 className="username-small">{user?.name || "Người dùng ẩn danh"}</h2>
                    <p className="email-text">{user?.email || "Chưa cập nhật"}</p>
                  </div>
  
                  <div 
                    className="manage-account-link"
                    onClick={() => {
                      setIsProfilePopupOpen(false); 
                      setIsManageModalOpen(true);   
                      setActiveTab("profile"); 
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Quản lý tài khoản
                  </div>
  
                  <div className="profile-footer">
                    <button
                      className="btn-danger popup-btn logout-btn"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
  
        {/* MAIN LAYOUT */}
        <div className="main-layout">
          <div className={`sidebar ${isSidebarOpen ? "" : "closed"}`}>
            <h3>Menu</h3>
            <p 
              onClick={() => navigate("/dashboard")}
              className={location.pathname === "/dashboard" ? "active-menu" : ""}
            >
              Dashboard
            </p>
            <p 
              onClick={() => navigate("/jobs")}
              className={location.pathname === "/jobs" ? "active-menu" : ""}
            >
              Jobs
            </p>
            <p 
              onClick={() => navigate("/candidates")}
              className={location.pathname === "/candidates" ? "active-menu" : ""}
            >
              Candidates
            </p>
            <p onClick={() => alert("Tính năng đang phát triển")}>Saved</p>
          </div>
  
          <div className="content">
            <h2>Available Jobs</h2>
            <div className="jobCard">Frontend Developer</div>
            <div className="jobCard">Backend Developer</div>
            <div className="jobCard">Fullstack Developer</div>
            <div className="jobCard">UI/UX Designer</div>
          </div>
        </div>
  
        {/* ==================================================== */}
        {/* MODAL QUẢN LÝ TÀI KHOẢN (MANAGE ACCOUNT) */}
        {/* ==================================================== */}
        {isManageModalOpen && (
          <div className="modal-overlay" onClick={() => setIsManageModalOpen(false)}>
            <div className="account-modal-container" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal-btn" onClick={() => setIsManageModalOpen(false)}>
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
                  
                  {/* PHÂN QUYỀN HIỂN THỊ TAB Ở ĐÂY */}
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
                {/* Nội dung Tab Profile */}
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
                        <p className="avatar-hint">Dung lượng file tối đa 1 MB<br/>Định dạng: .JPEG, .PNG</p>
                      </div>
                    </div>
                  </>
                )}
  
                {/* Nội dung Tab Bài Tuyển Dụng (Dành cho Recruiter) */}
                {activeTab === "my-jobs" && user?.role === "recruiter" && (
                  <div className="account-content-header">
                    <h2>Quản lý bài đăng</h2>
                    <p>Xem và chỉnh sửa các bài tuyển dụng bạn đã đăng.</p>
                    
                    <div style={{ marginTop: '20px', padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                      <p style={{ color: '#64748b', marginBottom: '15px' }}>Bạn chưa có bài đăng nào.</p>
                      <button className="btn-save-account" style={{ margin: '0' }}>+ Đăng tin mới</button>
                    </div>
                  </div>
                )}
  
                {/* Nội dung Tab Hồ sơ CV (Dành cho Ứng Viên) */}
                {activeTab === "my-cv" && user?.role !== "recruiter" && (
                  <div className="account-content-header">
                    <h2>Hồ sơ xin việc (CV)</h2>
                    <p>Tải lên CV của bạn để nhà tuyển dụng dễ dàng liên hệ.</p>
                    
                    <div style={{ marginTop: '20px', padding: '30px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <div style={{ fontSize: '40px' }}>📄</div>
                      <p style={{ color: '#475569', margin: 0, fontWeight: '500' }}>Tải lên CV của bạn (PDF)</p>
                      <button className="btn-choose-img" style={{ marginTop: '10px' }}>Chọn File CV</button>
                    </div>
                  </div>
                )}
  
                {/* Tab Thông Báo */}
                {activeTab === "notifications" && (
                  <div className="account-content-header">
                    <h2>Cài đặt thông báo</h2>
                    <p>Tính năng đang được phát triển...</p>
                  </div>
                )}
  
                {/* Tab Đổi Mật Khẩu */}
                {activeTab === "password" && (
                  <div className="account-content-header">
                    <h2>Đổi mật khẩu</h2>
                    <p>Tính năng đang được phát triển...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export default Dashboard;
