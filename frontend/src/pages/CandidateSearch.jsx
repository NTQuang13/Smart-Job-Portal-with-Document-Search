import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import axios from "axios";
import "./Dashboard.css";
import logo from "../assets/logo.png";

function CandidateSearch() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

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
      const res = await axios.get("http://localhost:3000/api/search/candidates", { params });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert("Lỗi tìm kiếm ứng viên");
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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="container">
      <header className="topbar">
        <div className="topbar-left">
          <button className="menu-btn" onClick={toggleSidebar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <img src={logo} alt="Jobminds Logo" className="logo-img" />
          <h1 className="site-name">
            <span className="textJob">job</span>
            <span className="textMinds">minds</span>
          </h1>
        </div>
        <div className="topbar-right">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              className="search"
              placeholder="Tìm kiếm ứng viên theo từ khóa..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleKeywordSearch()}
            />
            <button onClick={handleKeywordSearch} style={{ background: "none", border: "none", cursor: "pointer" }}>
              🔍
            </button>
          </div>
          <div className="user-greeting">
            Applied Jobs &nbsp;|&nbsp; Hi, {user?.name || "Người dùng"}
          </div>
          <div className="profile-dropdown-container">
            <div className="profileLogo" onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            {isProfilePopupOpen && (
              <div className="profile-popup">
                <div className="profile-header-small">
                  <div className="avatar popup-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : "U"}</div>
                  <h2 className="username-small">{user?.name || "Người dùng ẩn danh"}</h2>
                  <p className="email-text">{user?.email || "Chưa cập nhật"}</p>
                </div>
                <div className="manage-account-link" onClick={() => { setIsProfilePopupOpen(false); setIsManageModalOpen(true); setActiveTab("profile"); }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  Quản lý tài khoản
                </div>
                <button className="btn-danger popup-btn logout-btn" onClick={() => { 
                  localStorage.removeItem("accessToken"); 
                  localStorage.removeItem("refreshToken"); 
                  navigate("/"); 
                }}>
                  Đăng xuất
                </button>
                </div>
            )}
          </div>
        </div>
      </header>

      <div className="main-layout">
        <div className={`sidebar ${isSidebarOpen ? "" : "closed"}`}>
          <h3>Menu</h3>
          <p onClick={() => navigate("/dashboard")}>Dashboard</p>
          <p onClick={() => navigate("/jobs")}>Jobs</p>
          <p onClick={() => navigate("/candidates")} className="active-menu">Candidates</p>
          <p onClick={() => alert("Tính năng đang phát triển")}>Saved</p>
        </div>

        <div className="content">
          <h2>Tìm kiếm ứng viên</h2>

          {/* FORM TÌM KIẾM THEO KỸ NĂNG & ĐỊA ĐIỂM */}
          <div className="search-form">
            <input
              type="text"
              placeholder="Kỹ năng (ví dụ: Lập trình, Tin học văn phòng, Python...)"
              className="search-input"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
            <input
              type="text"
              placeholder="Địa điểm (ví dụ: Hà Nội, Đà Nẵng...)"
              className="search-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button className="search-button" onClick={handleFormSearch} disabled={loading}>
              {loading ? "Đang tìm..." : "Tìm kiếm"}
            </button>
          </div>

          {loading && <div className="loading-text">⏳ Đang tải dữ liệu...</div>}
          {results.length === 0 && !loading && <div className="loading-text">Chưa có kết quả. Hãy thử tìm kiếm với từ khóa khác.</div>}

          {results.map((hit, idx) => {
            const candidate = hit._source;
            return (
              <div key={candidate.id || idx} className="jobCard">
                <strong>Kỹ năng: {candidate.skills}</strong>
                <br />
                Học vấn: {candidate.education}
                <br />
                Địa điểm: {candidate.location}
                <br />
                Kinh nghiệm: {candidate.experience} năm
              </div>
            );
          })}
        </div>
      </div>

      {isManageModalOpen && (
        <div className="modal-overlay" onClick={() => setIsManageModalOpen(false)}>
          <div className="account-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setIsManageModalOpen(false)}>&times;</button>
            <div className="account-sidebar">
              <h3 className="account-sidebar-title">Cài đặt tài khoản</h3>
              <ul className="account-menu">
                <li className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>Hồ sơ của bạn</li>
                {user?.role === "recruiter" ? (
                  <li className={activeTab === "my-jobs" ? "active" : ""} onClick={() => setActiveTab("my-jobs")}>Bài tuyển dụng</li>
                ) : (
                  <li className={activeTab === "my-cv" ? "active" : ""} onClick={() => setActiveTab("my-cv")}>Hồ sơ (CV)</li>
                )}
                <li className={activeTab === "notifications" ? "active" : ""} onClick={() => setActiveTab("notifications")}>Cài đặt thông báo</li>
                <li className={activeTab === "password" ? "active" : ""} onClick={() => setActiveTab("password")}>Đổi mật khẩu</li>
              </ul>
            </div>
            <div className="account-content">
              <div className="account-content-header">
                <h2>Quản lý tài khoản</h2>
                <p>Chức năng đang được phát triển</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CandidateSearch;
