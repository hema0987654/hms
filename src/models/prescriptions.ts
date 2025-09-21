import pool from "../config/DB.js";

export interface Prescription {
  doctor_id: number;
  patient_id: number;
  appointment_id: number;
  advice: string;
}

const prescriptionDB = {
  async create(info: Prescription) {
    try {
      const query = `
        INSERT INTO prescriptions
          (doctor_id, patient_id, appointment_id, advice, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING *
      `;
      const values = [
        info.doctor_id,
        info.patient_id,
        info.appointment_id,
        info.advice,
      ];
      const { rows } = await pool.query(query, values);
      return { success: true, data: rows[0] };
    } catch (err) {
      console.error("Error creating prescription:", err);
      return { success: false, message: "Server error" };
    }
  },

  async getAll() {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM prescriptions ORDER BY created_at DESC`
      );
      return { success: true, data: rows };
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      return { success: false, message: "Server error" };
    }
  },

  async getById(id: number) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM prescriptions WHERE id = $1`,
        [id]
      );
      if (rows.length === 0)
        return { success: false, message: "Prescription not found" };
      return { success: true, data: rows[0] };
    } catch (err) {
      console.error("Error fetching prescription:", err);
      return { success: false, message: "Server error" };
    }
  },
  async update(id: number, advice: string) {
    try {
      const query = `
      UPDATE prescriptions
      SET advice = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
      const values = [advice, id];
      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
        return { success: false, message: "Prescription not found" };
      }

      return { success: true, data: rows[0] };
    } catch (err) {
      console.error("Error updating prescription:", err);
      return { success: false, message: "Server error" };
    }
  },
};

export default prescriptionDB;
