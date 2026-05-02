import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../utils/axiosClient";

import "./Dashboard.css";
import logo from "../assets/logo.png";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosClient.get("/users/me");
        setUser(res.data.user || res.data);
      } catch (err) {
        console.error("Không thể tải thông tin user:", err);
      }
    };
    fetchUser();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/signout");
    } catch (error) {
      console.log("Lỗi khi đăng xuất:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/jobs?keyword=${encodeURIComponent(searchKeyword)}`);
    }
  };

  return (
    <div className="container">
      {/* --- TOPBAR --- */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="hamburger-menu" onClick={toggleSidebar}>
            ☰
          </div>
          <div className="brand-wrapper" onClick={() => navigate("/dashboard")}>
            <img src={logo} className="logo-img" alt="logo" />
            <h1 className="site-name">
              <span className="textJob">job</span>
              <span className="textMinds">minds</span>
            </h1>
          </div>
        </div>

        <div className="topbar-center">
          <form className="search-container-new" onSubmit={handleSearch}>
            <span className="search-icon-glass">🔍</span>
            <input
              type="text"
              className="search-input-new"
              placeholder="Tìm kiếm công việc, kỹ năng..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </form>
        </div>

        <div className="topbar-right">
          <div
            className="user-profile-wrapper"
            onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
          >
            <span className="user-greeting">
              Hi, {user?.name || "User"}
            </span>

            <div className="profileLogo">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>

          {isProfilePopupOpen && (
            <div className="profile-popup">
              {/* HEADER */}
              <div className="popup-header">
                <div className="popup-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <p className="popup-name">
                    {user?.name || "User"}
                  </p>
                  <p className="popup-email">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>

              <div className="popup-divider"></div>

              {/* MENU */}
              <div
                className="popup-item"
                onClick={() => navigate("/account")}
              >
                <span className="popup-icon">👤</span>
                Hồ sơ của tôi
              </div>

              <div
                className="popup-item logout"
                onClick={handleLogout}
              >
                <span className="popup-icon">🚪</span>
                Đăng xuất
              </div>
            </div>
          )}
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <div className="main-layout">
        <aside className={`sidebar ${isSidebarOpen ? "" : "closed"}`}>
          <h3>Menu</h3>
          <nav>
            <div
              onClick={() => navigate("/dashboard")}
              className={`menu-item ${
                location.pathname === "/dashboard" ? "active-menu" : ""
              }`}
            >
              <span className="icon">📊</span>
              {isSidebarOpen && <span>Dashboard</span>}
            </div>

            <div
              onClick={() => navigate("/jobs")}
              className={`menu-item ${
                location.pathname === "/jobs" ? "active-menu" : ""
              }`}
            >
              <span className="icon">💼</span>
              {isSidebarOpen && <span>Jobs</span>}
            </div>

            <div
              onClick={() => navigate("/candidates")}
              className={`menu-item ${
                location.pathname === "/candidates" ? "active-menu" : ""
              }`}
            >
              <span className="icon">👤</span>
              {isSidebarOpen && <span>Candidates</span>}
            </div>
          </nav>
        </aside>

        <main className="content">
          <div className="content-inner">
            <section className="jobs-section">
              <h2>Available Jobs</h2>
              <div className="job-list">
                <div className="jobCard">Frontend Developer</div>
                <div className="jobCard">Backend Developer</div>
                <div className="jobCard">Fullstack Developer</div>
                <div className="jobCard">UI/UX Designer</div>
                <div className="jobCard">Mobile Developer</div>
                <div className="jobCard">DevOps Engineer</div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;