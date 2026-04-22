import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Import ảnh
import logoImage from "../assets/logo.png";
import signinIllustration from "../assets/signin.jpg";

function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("candidate");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignIn) {
        const res = await axios.post("http://localhost:3000/api/auth/signin", {
          email,
          password,
        }, {
          withCredentials: true
        });

        console.log("Dữ liệu signin trả về:", res.data); // Log ra để kiểm tra

        localStorage.setItem("accessToken", res.data.accessToken);
        navigate("/dashboard");
      } else {
        // --- ĐĂNG KÝ ---
        if (password !== confirmPassword) {
          alert("Mật khẩu xác nhận không khớp!");
          return;
        }

        const res = await axios.post("http://localhost:3000/api/auth/signup", {
          name,
          email,
          password,
          role,
        });

        console.log("Dữ liệu signup trả về:", res.data); // Log ra để kiểm tra

        alert("Đăng ký thành công! 🎉");
        setIsSignIn(true);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole("candidate");
      }
    } catch (err) {
      // BẮT LỖI CHI TIẾT HƠN TẠI ĐÂY
      console.error("Lỗi toàn bộ obj:", err);

      if (err.response) {
        // Lỗi do server trả về (VD: 400, 401, 500)
        console.error("Chi tiết data lỗi từ server:", err.response.data);

        // Cố gắng lấy message, nếu không có thì in ra dạng JSON
        const errorMessage =
          err.response.data.message || JSON.stringify(err.response.data);
        alert(`Lỗi từ Server: ${errorMessage}`);
      } else if (err.request) {
        // Lỗi không kết nối được tới server (Có thể do sai Port hoặc lỗi CORS)
        alert(
          "Lỗi kết nối: Không thể gọi tới Server. Hãy kiểm tra xem Server đã chạy chưa và có đúng cổng 3000 không.",
        );
      } else {
        // Lỗi do code React
        alert(`Lỗi React: ${err.message}`);
      }
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.card}>
        {/* ================= PHẦN BÊN TRÁI: FORM ================= */}
        <div style={styles.left}>
          <div style={styles.formWrapper}>
            <div style={styles.header}>
              {/* KHỐI LOGO & TÊN WEB */}
              <div style={styles.brandContainer}>
                <img src={logoImage} alt="Logo" style={styles.logoImg} />
                <div style={styles.brandText}>
                  <span style={styles.textJob}>job</span>
                  <span style={styles.textMinds}>minds</span>
                </div>
              </div>

              <h2 style={styles.title}>
                {isSignIn ? "Chào mừng quay lại" : "Tạo tài khoản mới"}
              </h2>
              <p style={styles.subtitle}>
                {isSignIn
                  ? "Đăng nhập vào tài khoản của bạn"
                  : "Điền thông tin để tham gia cùng chúng tôi"}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* TÊN (Chỉ hiện khi Đăng ký) */}
              {!isSignIn && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Họ và tên</label>
                  <input
                    type="text"
                    placeholder="Nhập họ và tên..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>
              )}

              {/* EMAIL */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Tên đăng nhập (Email)</label>
                <input
                  type="email"
                  placeholder="Ví dụ: email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              {/* MẬT KHẨU */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Mật khẩu</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              {/* XÁC NHẬN MẬT KHẨU (Chỉ hiện khi Đăng ký) */}
              {!isSignIn && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>
              )}

              {/* CHỌN ROLE (Chỉ hiện khi Đăng ký) */}
              {!isSignIn && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Vai trò của bạn</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={styles.select}
                    required
                  >
                    <option value="candidate">Ứng viên tìm việc</option>
                    <option value="recruiter">Nhà tuyển dụng</option>
                  </select>
                </div>
              )}

              <button type="submit" style={styles.button}>
                {isSignIn ? "Đăng nhập" : "Đăng ký"}
              </button>
            </form>

            <p style={styles.switchText}>
              {isSignIn ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
              <span style={styles.link} onClick={() => setIsSignIn(!isSignIn)}>
                {isSignIn ? "Đăng ký" : "Đăng nhập"}
              </span>
            </p>
          </div>
        </div>

        {/* ======== PHẦN BÊN PHẢI: ẢNH MINH HỌA ======== */}
        <div style={styles.right}>
          <img
            src={signinIllustration}
            alt="Đăng nhập Smart Job Portal"
            style={styles.illustrationImg}
          />
        </div>
      </div>
    </div>
  );
}

export default Auth;

// --- STYLES (Giữ nguyên không thay đổi) ---

const styles = {
  pageBackground: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #dde1f8 0%, #182542 100%)",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  },
  card: {
    display: "flex",
    width: "900px",
    minWidth: "900px",
    maxWidth: "900px",
    minHeight: "550px",
    height: "auto",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
  },
  left: {
    width: "50%",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "320px",
  },
  header: {
    textAlign: "center",
    marginBottom: "25px",
  },
  brandContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "15px",
  },
  logoImg: {
    width: "200px",
    height: "200px",
    objectFit: "contain",
    backgroundColor: "transparent",
    display: "block",
    marginBottom: "0px",
  },
  brandText: {
    marginTop: "0px",
    fontSize: "32px",
    fontWeight: "900",
    fontFamily: "'Arial Black', 'Impact', 'Inter', sans-serif",
    letterSpacing: "-1.5px",
  },
  textJob: {
    color: "#1a6bf2",
  },
  textMinds: {
    color: "#b5d1fe",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1f2937",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "10px 16px",
    borderRadius: "20px",
    border: "1px solid #d1d5db",
    backgroundColor: "#f9fafb",
    color: "#1f2937",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "10px 16px",
    borderRadius: "20px",
    border: "1px solid #d1d5db",
    backgroundColor: "#f9fafb",
    color: "#1f2937",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    cursor: "pointer",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#4b2bd9",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "8px",
    transition: "background-color 0.2s",
  },
  switchText: {
    textAlign: "center",
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "20px",
  },
  link: {
    color: "#622bd9",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
  },
  right: {
    width: "50%",
    backgroundColor: "#eff0fa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  illustrationImg: {
    width: "80%",
    height: "auto",
    maxHeight: "450px",
    objectFit: "contain",
  },
};
