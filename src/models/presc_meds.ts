import pool from "../config/DB.js";

//presc_meds

export interface Presc_meds {
  prescription_id: number;
  name: string;
  dosage: string;
  frequency_unit: string;
  frequency_count: number;
  duration_days: number;
}

const presc_medsDB = {
  async create(info: Presc_meds) {
    const query = `
      INSERT INTO prescription_medicines
      (prescription_id, name, dosage, frequency_unit, frequency_count,duration_days , created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *;
    `;
    const values = [
      info.prescription_id,
      info.name,
      info.dosage,
      info.frequency_unit,
      info.frequency_count,
      info.duration_days,
    ];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (err) {
      console.error("Error creating medicine:", err);
      throw err;
    }
  },

  async getAll() {
    const query = `SELECT * FROM prescription_medicines;`;
    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (err) {
      console.error("Error fetching medicines:", err);
      throw err;
    }
  },

  async getByPrescriptionId(prescription_id: number) {
    const query = `
      SELECT * FROM prescription_medicines
      WHERE prescription_id = $1;
    `;
    try {
      const { rows } = await pool.query(query, [prescription_id]);
      return rows;
    } catch (err) {
      console.error("Error fetching medicines by prescription:", err);
      throw err;
    }
  },

  async update(id: number, info: Partial<Presc_meds>) {
    const fields = [];
    const values: any[] = [];
    let index = 1;

    for (const key in info) {
      fields.push(`${key} = $${index}`);
      values.push(info[key as keyof Presc_meds]);
      index++;
    }

    if (fields.length === 0) return null;

    const query = `
      UPDATE prescription_medicines
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${index}
      RETURNING *;
    `;
    values.push(id);

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (err) {
      console.error("Error updating medicine:", err);
      throw err;
    }
  },
};

export default presc_medsDB;
