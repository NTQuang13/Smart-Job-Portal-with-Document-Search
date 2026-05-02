import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import axios from "axios";
import "./Dashboard.css";
import logo from "../assets/logo.png";

function JobSearch() {
  const navigate = useNavigate();
  const locationRouter = useLocation();
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get("keyword") || "";

  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

  const [keyword, setKeyword] = useState(initialKeyword);
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

  useEffect(() => {
    if (initialKeyword) {
      setKeyword(initialKeyword);
      callSearchAPI({ skill: initialKeyword, location: "" });
    }
  }, [initialKeyword]);

  const callSearchAPI = async (params) => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/search/jobs", { params });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert("Lỗi tìm kiếm công việc");
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordSearch = () => {
    if (!keyword.trim()) {
      alert("Vui lòng nhập từ khóa");
      return;
    }
    callSearchAPI({ skill: keyword, location: "" });
  };

  const handleFormSearch = () => {
    if (!skill.trim() && !location.trim()) {
      alert("Vui lòng nhập ít nhất kỹ năng hoặc địa điểm");
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
const toggleSidebar = () => {
  setIsSidebarOpen(prev => !prev);
};

  return (
    <div className="container">
      {/* TOPBAR */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="hamburger-menu" onClick={toggleSidebar}>☰</div>

          <div className="brand-wrapper" onClick={() => navigate("/dashboard")}>
            <img src={logo} className="logo-img" alt="logo" />
            <h1 className="site-name">
              <span className="textJob">job</span>
              <span className="textMinds">minds</span>
            </h1>
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div className="topbar-center">
          <form
            className="search-container-new"
            onSubmit={(e) => {
              e.preventDefault();
              handleKeywordSearch();
            }}
          >
            <span className="search-icon-glass">🔍</span>
            <input
              type="text"
              className="search-input-new"
              placeholder="Tìm kiếm công việc, kỹ năng..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>
        </div>

        {/* RIGHT */}
        <div className="topbar-right">
          <div
            className="user-profile-wrapper"
            onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
          >
            <span className="user-greeting">
              Hi, {user?.name || "Người dùng"}
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

      {/* MAIN */}
      <div className="main-layout">
        <aside className={`sidebar ${isSidebarOpen ? "" : "closed"}`}>
          <h3>Menu</h3>

          <div
            className={`menu-item ${locationRouter.pathname === "/dashboard" ? "active-menu" : ""}`}
            onClick={() => navigate("/dashboard")}
          >
            <span className="menu-icon">📊</span>
            {isSidebarOpen && <span className="menu-text">Dashboard</span>}
          </div>

          <div
            className={`menu-item ${locationRouter.pathname === "/jobs" ? "active-menu" : ""}`}
            onClick={() => navigate("/jobs")}
          >
            <span className="menu-icon">💼</span>
            {isSidebarOpen && <span className="menu-text">Jobs</span>}
          </div>

          <div
            className={`menu-item ${locationRouter.pathname === "/candidates" ? "active-menu" : ""}`}
            onClick={() => navigate("/candidates")}
          >
            <span className="menu-icon">👤</span>
            {isSidebarOpen && <span className="menu-text">Candidates</span>}
          </div>

          
        </aside>

        {/* CONTENT */}
        <main className="content">
          <div className="content-inner">
            <h2>Tìm kiếm công việc</h2>

            {/* ===== FORM MỚI (ĐÃ FIX UI) ===== */}
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

            {loading && <div className="loading-text">⏳ Đang tải dữ liệu...</div>}

            {results.length === 0 && !loading && (
              <div className="loading-text">
                Chưa có kết quả. Hãy thử tìm kiếm với từ khóa khác.
              </div>
            )}

            <div className="job-list">
              {results.map((hit, idx) => {
                const job = hit?._source || {};
                return (
                  <div key={job.id || idx} className="jobCard">
                    <strong>{job.title}</strong> - {job.location}
                    <br />
                    {job.description}
                    <br />
                    Kỹ năng: {job.skills_required}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default JobSearch;