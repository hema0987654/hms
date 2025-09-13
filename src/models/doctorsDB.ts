import pool from "../config/DB.js";

export interface Doctor {
  user_id: number;
  specialization: string;
  bio?: string;
  schedule?: Record<string, string[]>;
  licenseNumber: string;
  clinicRoom?: string;
}

const doctorDB = {
  async createDoctor(info: Doctor) {
    const query = `
      INSERT INTO doctors (user_id, specialization, bio, schedule, license_number, clinic_room)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      info.user_id,
      info.specialization,
      info.bio || null,
      info.schedule ? JSON.stringify(info.schedule) : null,
      info.licenseNumber,
      info.clinicRoom || null,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Error inserting doctor:", err);
      throw err;
    }
  },

  async getDoctorByUserId(userId: number) {
    const query = `SELECT * FROM doctors WHERE user_id = $1`;
    try {
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (err) {
      console.error("Error fetching doctor:", err);
      throw err;
    }
  },

  async getAllDoctors() {
    const query = `SELECT * FROM doctors`;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (err) {
      console.error("Error fetching doctors:", err);
      throw err;
    }
  },

  async updateDoctor(userId: number, info: Partial<Doctor>) {
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const [key, value] of Object.entries(info)) {
      if (value !== undefined) {
        fields.push(`${this.toSnakeCase(key)} = $${index}`);
        values.push(key === "schedule" ? JSON.stringify(value) : value);
        index++;
      }
    }

    if (fields.length === 0) return null;

    const query = `
      UPDATE doctors
      SET ${fields.join(", ")}
      WHERE user_id = $${index}
      RETURNING *;
    `;
    values.push(userId);

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Error updating doctor:", err);
      throw err;
    }
  },

  async deleteDoctor(userId: number) {
    const query = `DELETE FROM doctors WHERE user_id = $1`;
    try {
      await pool.query(query, [userId]);
      return true;
    } catch (err) {
      console.error("Error deleting doctor:", err);
      throw err;
    }
  },

  toSnakeCase(str: string) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  },

  async searchDoctors(specialization: string, day: string, time: string) {
    const query = `
    SELECT *
    FROM doctors
    WHERE specialization ILIKE $1
      AND schedule->>$2 IS NOT NULL
  `;
    const values = [`%${specialization}%`, day];

    try {
      const result = await pool.query(query, values);
      // Filter doctors based on the time slot becuse SQL can't handle complex JSON queries easily
      const availableDoctors = result.rows.filter((doctor: any) => {
        const schedule = doctor.schedule ? JSON.parse(doctor.schedule) : {};
        const times = schedule[day] || [];
        return times.some((slot: string) => {
          const [start, end] = slot.split("-");
          return (
            start !== undefined &&
            end !== undefined &&
            time >= start &&
            time <= end
          );
        });
      });

      return availableDoctors;
    } catch (err) {
      console.error("Error searching doctors:", err);
      throw err;
    }
  },
};

export default doctorDB;
