import pool from "../config/DB.js";

class MessagesDB {
  async createMessage(sender_id: number, receiver_id: number, content: string) {
    const query = `
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await pool.query(query, [sender_id, receiver_id, content]);
    return result.rows[0];
  }

  async getConversation(user1: number, user2: number) {
    const query = `
      SELECT * FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2)
         OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC;
    `;
    const result = await pool.query(query, [user1, user2]);
    return result.rows;
  }
}

export default new MessagesDB();
