export const createCVTable = async (db) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS cvs (
      id VARCHAR(255) PRIMARY KEY,
      userId VARCHAR(255) NOT NULL,
      fileName VARCHAR(255) NOT NULL,
      filePath VARCHAR(255) NOT NULL,
      fileSize INT NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  await db.query(sql);
  console.log("✅ Bảng 'cvs' đã sẵn sàng!");
};
