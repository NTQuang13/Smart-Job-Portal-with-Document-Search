import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import logo from "../assets/logo.png";
import "./AccountPage.css";

function AccountPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosClient.get("/users/me");
        setUser(res.data.user || res.data);
      } catch {
        localStorage.removeItem("accessToken");
        navigate("/");
      }
    };
    fetchUser();
  }, [navigate]);

  // đóng popup khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfilePopupOpen(false);
    };

    if (isProfilePopupOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isProfilePopupOpen]);

  const isActive = (path) => location.pathname.includes(path);

  if (!user) return null;

  return (
    <div className="account-container">
      {/* ===== TOPBAR ===== */}
      <header className="topbar">
        <div className="topbar-left">
          <div
            className="hamburger-menu"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </div>

          <div
            className="brand-wrapper"
            onClick={() => navigate("/dashboard")}
          >
            <img src={logo} className="logo-img" alt="logo" />
            <h1 className="site-name">
              <span className="textJob">job</span>
              <span className="textMinds">minds</span>
            </h1>
          </div>
        </div>

        <div className="topbar-right">
          <div className="user-greeting">Hi, {user.name}</div>

          {/* AVATAR */}
          <div
            className="profileLogo"
            onClick={(e) => {
              e.stopPropagation();
              setIsProfilePopupOpen(!isProfilePopupOpen);
            }}
          >
            {user.name?.charAt(0)}
          </div>

          {/* ===== PROFILE POPUP ===== */}
          {isProfilePopupOpen && (
            <div
              className="profile-popup"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="popup-header">
                <div className="popup-avatar">
                  {user.name?.charAt(0)}
                </div>

                <div>
                  <p className="popup-name">{user.name}</p>
                  <p className="popup-email">{user.email}</p>
                </div>
              </div>

              <div className="popup-divider"></div>

              {/* MENU */}
              <div
                className="popup-item"
                onClick={() => {
                  navigate("/account/profile");
                  setIsProfilePopupOpen(false);
                }}
              >
                👤 Hồ sơ của tôi
              </div>

              <div
                className="popup-item"
                onClick={() => {
                  navigate("/account/password");
                  setIsProfilePopupOpen(false);
                }}
              >
                🔒 Đổi mật khẩu
              </div>

              <div className="popup-divider"></div>

              <div
                className="popup-item logout"
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  navigate("/");
                }}
              >
                🚪 Đăng xuất
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="main-layout">
        {/* SIDEBAR */}
        <aside className={`sidebar ${isSidebarOpen ? "" : "closed"}`}>
          <div className="sidebar-title">
            {isSidebarOpen ? "" : "⚙️"}
          </div>
          <nav>
            <div
              className={`menu-item ${isActive("profile") ? "active-menu" : ""}`}
              onClick={() => navigate("/account/profile")}
            >
              👤 {isSidebarOpen && "Hồ sơ cá nhân"}
            </div>

            {/* THÊM MỤC CÔNG TY CHO NHÀ TUYỂN DỤNG */}
            {user.role === "recruiter" && (
              <div
                className={`menu-item ${isActive("company") ? "active-menu" : ""}`}
                onClick={() => navigate("/account/company")}
              >
                🏢 {isSidebarOpen && "Thông tin công ty"}
              </div>
            )}

            {user.role === "recruiter" ? (
              <div
                className={`menu-item ${isActive("jobs") ? "active-menu" : ""}`}
                onClick={() => navigate("/account/jobs")}
              >
                💼 {isSidebarOpen && "Bài tuyển dụng"}
              </div>
            ) : (
              <div
                className={`menu-item ${isActive("cv") ? "active-menu" : ""}`}
                onClick={() => navigate("/account/cv")}
              >
                📄 {isSidebarOpen && "Quản lý CV"}
              </div>
            )}

            <div
              className={`menu-item ${isActive("password") ? "active-menu" : ""}`}
              onClick={() => navigate("/account/password")}
            >
              🔒 {isSidebarOpen && "Đổi mật khẩu"}
            </div>

            <div
              className="menu-item"
              onClick={() => navigate("/dashboard")}
            >
              ← {isSidebarOpen && "Quay lại"}
            </div>

          </nav>
        </aside>

        {/* CONTENT */}
        <main className="content">
          <div className="account-card">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AccountPage;