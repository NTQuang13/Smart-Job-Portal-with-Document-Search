import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CandidateSearch from "./pages/CandidateSearch";
import JobSearch from "./pages/JobSearch";

import AccountLayout from "./pages/AccountPage";
import ProfileTab from "./pages/ProfileTab";
import PasswordTab from "./pages/PasswordTab";
import CVTab from "./pages/CVTab";
import JobsTab from "./pages/JobsTab";
import CompanyTab from "./pages/CompanyTab";
import AccountPage from "./pages/AccountPage";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />

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

        {/* ===== ACCOUNT ROUTES ===== */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfileTab />} />
          <Route path="password" element={<PasswordTab />} />
          <Route path="cv" element={<CVTab />} />
          <Route path="jobs" element={<JobsTab />} />
          <Route path="company" element={<CompanyTab />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;