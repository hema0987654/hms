import pool from "../config/DB.js";

export interface Patient {
  userId: number;
  age?: number;
  gender: "Male" | "Female";
  address?: string;
  emergencyContact?: string;
}

const patientDB = {
  async setPatient(info: Patient) {
    const query = `
      INSERT INTO patients (userId, age, gender, address, emergencyContact)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [
      info.userId,
      info.age,
      info.gender,
      info.address,
      info.emergencyContact,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0]; 
    } catch (err) {
      console.error("Error inserting patient:", err);
      throw err;
    }
  },

  async getPatientByUserId(userId: number) {
    const query = `SELECT * FROM patients WHERE userId = $1`;
    const values = [userId];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Error fetching patient:", err);
      throw err;
    }
  },

  async getAllPatients() {
    const query = `SELECT * FROM patients`;
    try {
      const result = await pool.query(query);
      return result.rows; 
    } catch (err) {
      console.error("Error fetching patients:", err);
      throw err;
    }
  },

  async updatePatient(userId: number, info: Partial<Patient>) {
    const query = `
      UPDATE patients 
      SET age = $2, gender = $3, address = $4, emergencyContact = $5
      WHERE userId = $1
      RETURNING *;
    `;

    const values = [
      userId,
      info.age,
      info.gender,
      info.address,
      info.emergencyContact,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Error updating patient:", err);
      throw err;
    }
  },

  async deletePatient(userId: number) {
    const query = `DELETE FROM patients WHERE userId = $1 RETURNING *`;
    const values = [userId];
    try {
      const result = await pool.query(query, values);
      return result.rows[0]; 
    } catch (err) {
      console.error("Error deleting patient:", err);
      throw err;
    }
  },
};

export default patientDB;