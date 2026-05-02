import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import axios from "axios";
import "./Dashboard.css";
import logo from "../assets/logo.png";

function CandidateSearch() {
  const navigate = useNavigate();
  const locationPath = useLocation();

  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const callSearchAPI = async (params) => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:3000/api/search/candidates",
        { params }
      );
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert("Lỗi tìm kiếm ứng viên");
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    callSearchAPI({ skill: keyword, location: "" });
  };

  const handleFormSearch = () => {
    if (!skill.trim() && !location.trim()) {
      alert("Nhập skill hoặc location");
      return;
    }
    callSearchAPI({ skill, location });
  };
  const handleLogout = async () => {
  try {
    await axiosClient.post("/auth/signout");
  } catch (err) {
    console.log("Logout lỗi:", err);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  }
};

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="container">
      {/* ===== TOPBAR ===== */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="hamburger-menu" onClick={toggleSidebar}>
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

        {/* CENTER SEARCH */}
        <div className="topbar-center">
          <form className="search-bar-container" onSubmit={handleKeywordSearch}>
            <input
              type="text"
              className="topbar-search-input"
              placeholder="Tìm kiếm ứng viên, kỹ năng..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button className="topbar-search-btn">🔍</button>
          </form>
        </div>

        {/* RIGHT */}
        <div className="topbar-right">
          <div
            className="user-info"
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

      {/* ===== MAIN ===== */}
      <div className="main-layout">
        <aside className={`sidebar ${isSidebarOpen ? "" : "closed"}`}>
          <h3>Menu</h3>

          <div
            className={`menu-item ${
              locationPath.pathname === "/dashboard" ? "active-menu" : ""
            }`}
            onClick={() => navigate("/dashboard")}
          >
            <span className="icon">📊</span>
            {isSidebarOpen && <span>Dashboard</span>}
          </div>

          <div
            className={`menu-item ${
              locationPath.pathname === "/jobs" ? "active-menu" : ""
            }`}
            onClick={() => navigate("/jobs")}
          >
            <span className="icon">💼</span>
            {isSidebarOpen && <span>Jobs</span>}
          </div>

          <div
            className={`menu-item ${
              locationPath.pathname === "/candidates"
                ? "active-menu"
                : ""
            }`}
            onClick={() => navigate("/candidates")}
          >
            <span className="icon">👤</span>
            {isSidebarOpen && <span>Candidates</span>}
          </div>
        </aside>

        {/* CONTENT */}
        <main className="content">
          <div className="content-inner">
            <h2>Tìm kiếm ứng viên</h2>

            {/* ===== FORM MỚI (GIỐNG JOB SEARCH) ===== */}
            <form
              className="search-form-modern"
              onSubmit={(e) => {
                e.preventDefault();
                handleFormSearch();
              }}
            >
              <input
                type="text"
                placeholder="Kỹ năng..."
                className="search-input-modern"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              />

              <input
                type="text"
                placeholder="Địa điểm..."
                className="search-input-modern"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <button className="search-btn-modern">
                🔍
              </button>
            </form>

            {/* RESULT */}
            <div className="job-list">
              {results.map((hit, idx) => {
                const c = hit._source;
                return (
                  <div key={idx} className="jobCard">
                    <strong>{c.skills}</strong>
                    <p>📍 {c.location}</p>
                    <p>🎓 {c.education}</p>
                    <p>💼 {c.experience} năm kinh nghiệm</p>
                  </div>
                );
              })}
            </div>

            {!loading && results.length === 0 && (
              <p style={{ marginTop: 20, color: "#757d89" }}>
                Chưa có kết quả. Hãy thử tìm kiếm với từ khóa khác.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default CandidateSearch;