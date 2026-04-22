import pool from "../libs/db.js";

export const getMe = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json(user);
  } catch (error) {
    console.log("Lỗi khi gọi authMe", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const targetId = req.params.id;
    const [users] = await pool.query(
      "SELECT id, name, email, role, createdAt FROM users WHERE id = ?",
      [targetId],
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
