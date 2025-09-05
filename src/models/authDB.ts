import pool from "../config/DB.js";

export interface Info {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
}

const usersBD = {
  async createUser(infoUsers: Info) {
    const query = `
      INSERT INTO users (name, email, password, role, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      infoUsers.name,
      infoUsers.email,
      infoUsers.password,
      infoUsers.role,
      infoUsers.phone,
    ];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  },

  async findUser(email: string) {
    const query = `
      SELECT * 
      FROM users 
      WHERE email = $1
    `;
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  },

  async updatepassword(email: string, newPassword: string) {
    const query = `
      UPDATE users 
      SET password = $1
      WHERE email = $2
      RETURNING *;
    `;
    try {
      const result = await pool.query(query, [newPassword, email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    } }
};

export default usersBD;
