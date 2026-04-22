# Smart Job Portal with Document Search

Dưới đây là hướng dẫn chi tiết các bước để thiết lập và chạy dự án sau khi bạn clone về máy.

## Yêu cầu hệ thống (Prerequisites)

- [Node.js](https://nodejs.org/) (Khuyến nghị phiên bản v18 trở lên)
- [MySQL](https://www.mysql.com/) (Hoặc XAMPP/WAMP để chạy MySQL server)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Bắt buộc để chạy Elasticsearch)

---

## Hướng dẫn cài đặt và chạy dự án

### 1. Thiết lập Database (MySQL)

1. Hãy đảm bảo bạn đã cài đặt và bật MySQL server.
2. Mở thư mục `backend`, tạo một file tên là `.env` (bạn có thể copy từ `.env.example` nếu có) và cấu hình các thông số kết nối cơ sở dữ liệu:
   ```env
   DB_HOST=localhost
   DB_USER=root      # Thay bằng username MySQL của bạn
   DB_PASS=          # Thay bằng mật khẩu MySQL của bạn
   DB_NAME=job_portal
   ```
   _(Lưu ý: Nếu không sử dụng file `.env`, hệ thống sẽ lấy tài khoản mặc định được code cứng trong `backend/src/libs/db.js` và `backend/src/libs/init-db.js`)._
3. Mở terminal tại thư mục `backend`, chạy lệnh sau để cài đặt các thư viện cần thiết (bao gồm express, multer, bullmq, pdf2json, v.v.):
   ```bash
   npm install
   ```
4. Chạy lệnh sau để tự động tạo Database và các bảng:
   ```bash
   npm run db:init
   ```

### 2. Thiết lập Elasticsearch (Docker)

Hệ thống sử dụng Elasticsearch thông qua Docker để tìm kiếm văn bản.

1. Bật ứng dụng **Docker Desktop** trên máy của bạn.
2. Mở terminal tại **thư mục gốc của dự án** (nơi chứa file `docker-compose.yml`) và chạy lệnh:
   ```bash
   docker compose up -d
   ```
3. Sau khi Docker container đã chạy thành công, chuyển vào thư mục `backend` và chạy lệnh seed dữ liệu:
   ```bash
   node seed-es.cjs
   ```
   _(Lưu ý: Lệnh seed này **chỉ cần chạy 1 lần duy nhất** khi mới clone project về để khởi tạo index trên Elasticsearch)._

### 3. Khởi chạy Backend và Worker

Hệ thống backend yêu cầu chạy song song server API và worker xử lý nền. Bạn cần mở 2 terminal riêng biệt:

- **Terminal 1 (Chạy API Server):**
  Tại thư mục `backend`, chạy lệnh:
  ```bash
  npm run dev
  ```
- **Terminal 2 (Chạy BullMQ Worker):**
  Tại thư mục `backend`, chạy lệnh:
  ```bash
  node src/workers/cvWorker.js
  ```

### 4. Khởi chạy Frontend

- **Terminal 3 (Chạy Giao diện):**
  Mở terminal tại thư mục `frontend` và cài đặt các thư viện:
  ```bash
  npm install
  ```
  Sau đó khởi động React/Vite:
  ```bash
  npm run dev
  ```

---

## API Documentation

Hệ thống cung cấp sẵn file `swagger.yaml` để tham khảo tài liệu API.

- Bạn có thể cài đặt extension **OpenAPI (Swagger) Editor** trong VS Code hoặc sử dụng [Swagger Editor Online](https://editor.swagger.io/).
- Mở hoặc paste nội dung file `swagger.yaml` vào để xem cấu trúc và test trực tiếp các API.
