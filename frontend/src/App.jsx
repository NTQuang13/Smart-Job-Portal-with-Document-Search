import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CandidateSearch from "./pages/CandidateSearch";
import JobSearch from "./pages/JobSearch";

// ==========================================
// 1. TRẠM GÁC BẢO MẬT (Cho các trang cần đăng nhập)
// ==========================================
const ProtectedRoute = ({ children }) => {
  // Kiểm tra xem có chìa khoá không
  const isAuthenticated = !!localStorage.getItem("accessToken");

  // Nếu có chìa -> Cho phép vào (render children)
  // Nếu không -> Bắt quay đầu về trang chủ ("/")
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// ==========================================
// 2. TRẠM GÁC MỘT CHIỀU (Cho trang Đăng nhập/Đăng ký)
// ==========================================
const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("accessToken");

  // Nếu đã đăng nhập rồi -> Không cho xem trang Auth nữa, đẩy thẳng vào Dashboard
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Đường dẫn công khai: Chỉ ai CHƯA đăng nhập mới được vào */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />

        {/* Đường dẫn bảo mật: Chỉ ai ĐÃ đăng nhập mới được vào */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
        path="/candidates"
        element={
          <ProtectedRoute>
            <CandidateSearch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <JobSearch />
          </ProtectedRoute>
        }
      />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
