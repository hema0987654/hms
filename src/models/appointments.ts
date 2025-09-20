import pool from "../config/DB.js";

export interface Appointment {
  patient_user_id: number;
  doctor_user_id: number;
  starts_at: string;
  ends_at: string;
  status?: "Pending" | "Confirmed" | "Completed";
  notes?: string;
}


const AppointmentModel = {
  async create(appointment: Appointment) {
    const query = `
      INSERT INTO appointments (patient_user_id, doctor_user_id, starts_at, ends_at, status, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      appointment.patient_user_id,
      appointment.doctor_user_id,
      appointment.starts_at,
      appointment.ends_at,
      appointment.status || "Pending",
      appointment.notes || null,
    ];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Error creating appointment:", err);
      throw err;
    }
  },

  async getById(appointmentId: number) {
    const query = `SELECT * FROM appointments WHERE id = $1`;
    try {
      const result = await pool.query(query, [appointmentId]);
      return result.rows[0];
    } catch (err) {
      console.error("Error fetching appointment:", err);
      throw err;
    }
  },

  async getAll() {
    const query = `SELECT * FROM appointments ORDER BY starts_at ASC`;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (err) {
      console.error("Error fetching all appointments:", err);
      throw err;
    }
  },

  async update(appointmentId: number, updates: Partial<Appointment>) {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const key in updates) {
    if (!Object.prototype.hasOwnProperty.call(updates, key)) continue;
    fields.push(`${key} = $${idx}`);
    values.push((updates as any)[key]);
    idx++;
  }

  if (fields.length === 0) return null;

  const query = `
    UPDATE appointments
    SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${idx}
    RETURNING *;
  `;
  values.push(appointmentId);

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Error updating appointment:", err);
    throw err;
  }
},


  async delete(appointmentId: number) {
    const query = `DELETE FROM appointments WHERE id = $1 RETURNING *`;
    try {
      const result = await pool.query(query, [appointmentId]);
      return result.rows[0];
    } catch (err) {
      console.error("Error deleting appointment:", err);
      throw err;
    }
  },

  async getByDoctorId(doctorId: number) {
    const query = `
      SELECT * FROM appointments
      WHERE doctor_user_id = $1
      ORDER BY starts_at ASC
    `;
    try {
      const result = await pool.query(query, [doctorId]);
      return result.rows;
    } catch (err) {
      console.error("Error fetching doctor appointments:", err);
      throw err;
    }
  },

  async getByPatientId(patientId: number) {
    const query = `
      SELECT * FROM appointments
      WHERE patient_user_id = $1
      ORDER BY starts_at ASC
    `;
    try {
      const result = await pool.query(query, [patientId]);
      return result.rows;
    } catch (err) {
      console.error("Error fetching patient appointments:", err);
      throw err;
    }
  },

  async findOverlapping(doctor_user_id: number, starts_at: string, ends_at: string) {
    const query = `
      SELECT *
      FROM appointments
      WHERE doctor_user_id = $1
        AND status IN ('Pending', 'Confirmed')
        AND (tsrange(starts_at, ends_at) && tsrange($2::timestamp, $3::timestamp))
    `;

    const values = [doctor_user_id, starts_at, ends_at];
    const { rows } = await pool.query(query, values);
    return rows; 
  }
};

export default AppointmentModel;
