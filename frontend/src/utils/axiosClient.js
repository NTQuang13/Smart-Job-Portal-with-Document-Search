import axios from "axios";

// Khởi tạo một instance của axios
const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// INTERCEPTOR REQUEST: Tự động gắn Access Token trước khi gửi
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// INTERCEPTOR RESPONSE: Bắt lỗi 401 và tự động Refresh Token
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu request thành công, trả về data luôn
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 (Hết hạn Access Token) và chưa từng retry (tránh lặp vô hạn)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API cấp lại token mới
        // cookie chứa refreshToken sẽ tự gửi kèm vì cấu hình withCredentials: true
        const res = await axios.post(
          "http://localhost:3000/api/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        // Cập nhật Access Token mới vào LocalStorage
        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Gắn token mới vào request ban đầu bị lỗi và gửi lại
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Nếu Refresh Token cũng hết hạn nốt -> Văng ra màn hình Login
        console.error("Refresh token expired", refreshError);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
