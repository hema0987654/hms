import pool from "../config/DB.js";

interface TempUser {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  otp: string;
  otpExpires: Date;
}

export const insertTempUser = async (user: TempUser) => {
  const { name, email, password, role, phone, otp, otpExpires } = user;
  return pool.query(
    `INSERT INTO temp_users (name, email, password, role, phone, otp, otp_expires)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [name, email, password, role, phone, otp, otpExpires]
  );
};

export const findTempUserByEmailAndOtp = async (email: string, otp: string) => {
  return pool.query(
    `SELECT * FROM temp_users WHERE email=$1 AND otp=$2 AND otp_expires > NOW()`,
    [email, otp]
  );
};

export const deleteTempUser = async (email: string) => {
  return pool.query(`DELETE FROM temp_users WHERE email=$1`, [email]);
};
