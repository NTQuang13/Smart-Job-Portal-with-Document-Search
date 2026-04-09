export const createCVExtractedTable = async (db) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS cv_extracted_data (
      id VARCHAR(255) PRIMARY KEY,
      cvId VARCHAR(255) NOT NULL,
      rawText LONGTEXT NOT NULL, 
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cvId) REFERENCES cvs(id) ON DELETE CASCADE
    );
  `;
  // Lưu ý: Dùng LONGTEXT thay vì TEXT thông thường vì dữ liệu chữ trong CV có thể rất dài.

  await db.query(sql);
  console.log("✅ Bảng 'cv_extracted_data' đã sẵn sàng!");
};
