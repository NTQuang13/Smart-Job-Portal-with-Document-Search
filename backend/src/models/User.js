import mysql from "mysql2/promise";
import "dotenv/config";

async function setupDatabase() {
  try {
    // 1. Kết nối đến MySQL 
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "", // Điền tên user
      password: process.env.DB_PASS || "", // Điền password
    });

    console.log("⏳ Đang kết nối MySQL...");

    // 2. Tạo Database nếu chưa có
    const dbName = process.env.DB_NAME || "job_portal";
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    console.log(`✅ Đã tạo hoặc tìm thấy Database: ${dbName}`);

    // 3. Chọn Database để làm việc
    await connection.query(`USE \`${dbName}\``);

    // 4. Tạo bảng users
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('candidate', 'recruiter') NOT NULL DEFAULT 'candidate',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await connection.query(createUsersTable);
    console.log("✅ Đã tạo bảng 'users' thành công!");

    // Thêm các câu lệnh CREATE TABLE khác ở đây 

    console.log("🎉 KHỞI TẠO CƠ SỞ DỮ LIỆU HOÀN TẤT!");
    await connection.end(); // Đóng kết nối
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi khởi tạo Database:", error);
    process.exit(1);
  }
}

setupDatabase();
