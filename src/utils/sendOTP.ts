import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,      
    pass: process.env.EMAIL_PASSWORD,   
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: "🔐 HMS - Verify Your Account",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #007bff, #0056b3); padding: 20px; text-align: center; color: #fff;">
            <h1 style="margin: 0; font-size: 24px;">HMS Verification</h1>
          </div>

          <!-- Body -->
          <div style="padding: 30px; text-align: center; color: #333;">
            <p style="font-size: 16px; margin-bottom: 10px;">Hello 👋,</p>
            <p style="font-size: 16px; margin-bottom: 20px;">
              Use the following <strong>One-Time Password (OTP)</strong> to verify your account:
            </p>

            <!-- OTP Box -->
            <div style="margin: 20px auto; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #007bff; background: #f1f6ff; padding: 15px; border-radius: 10px; display: inline-block;">
              ${otp}
            </div>

            <!-- CTA Button -->
            <div style="margin: 25px 0;">
              <a href="#" style="background: #007bff; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; display: inline-block;">
                Verify Now
              </a>
            </div>

            <p style="font-size: 14px; color: #555;">
              This OTP is valid for <strong>5 minutes</strong>.  
              If you did not request this code, you can safely ignore this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p style="margin: 0;">© ${new Date().getFullYear()} HMS. All rights reserved.</p>
          </div>

        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


export const sendEmailToPatient = async (
  email: string,
  patientName: string,
  doctorName: string,
  startsAt: Date,
  endsAt: Date
) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const startFormatted = startsAt.toLocaleString("en-US", options);
  const endFormatted = endsAt.toLocaleString("en-US", options);

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: "✅ HMS - Appointment Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #28a745, #218838); padding: 20px; text-align: center; color: #fff;">
            <h1 style="margin: 0; font-size: 22px;">Appointment Confirmed</h1>
          </div>

          <!-- Body -->
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Hello <b>${patientName}</b> 👋,</p>
            <p style="font-size: 16px;">
              Your appointment with <b>Dr. ${doctorName}</b> has been successfully booked.
            </p>

            <!-- Appointment Details -->
            <div style="margin: 20px 0; padding: 15px; background: #f1f6ff; border-left: 5px solid #28a745; border-radius: 8px;">
              <p style="margin: 0; font-size: 15px;"><b>Start:</b> ${startFormatted}</p>
              <p style="margin: 5px 0 0 0; font-size: 15px;"><b>End:</b> ${endFormatted}</p>
            </div>

            <p style="font-size: 14px; color: #555;">
              Please make sure to arrive <b>10 minutes earlier</b>.  
              If you have any questions, feel free to contact us.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p style="margin: 0;">© ${new Date().getFullYear()} HMS. All rights reserved.</p>
          </div>

        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendEmailToDoctor = async (
  email: string,
  doctorName: string,
  patientName: string,
  patientAge: number,
  patientGender: string,
  startsAt: Date,
  endsAt: Date,
  appointmentId: number,
  doctorId: number
) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const startFormatted = startsAt.toLocaleString("en-US", options);
  const endFormatted = endsAt.toLocaleString("en-US", options);

const approveUrl = `${process.env.BASE_URL}/HMS/Am/confirm?appointmentId=${appointmentId}&doctorId=${doctorId}`;
const rejectUrl = `${process.env.BASE_URL}/HMS/Am/reject?appointmentId=${appointmentId}&doctorId=${doctorId}`;

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: "✅ HMS - New Appointment Booked",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #007bff, #0056b3); padding: 20px; text-align: center; color: #fff;">
            <h1 style="margin: 0; font-size: 22px;">New Appointment Booked</h1>
          </div>

          <!-- Body -->
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Hello <b>Dr. ${doctorName}</b> 👋,</p>
            <p style="font-size: 16px;">
              You have a new appointment with patient <b>${patientName}</b>, age <b>${patientAge}</b>, gender <b>${patientGender}</b>.
            </p>

            <!-- Appointment Details -->
            <div style="margin: 20px 0; padding: 15px; background: #f1f6ff; border-left: 5px solid #007bff; border-radius: 8px;">
              <p style="margin: 0; font-size: 15px;"><b>Start:</b> ${startFormatted}</p>
              <p style="margin: 5px 0 0 0; font-size: 15px;"><b>End:</b> ${endFormatted}</p>
            </div>

            <!-- Action Buttons -->
            <div style="margin: 30px 0; text-align: center;">
              <a href="${approveUrl}" style="background: #28a745; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; margin-right: 10px;">
                ✅ Approve
              </a>
              <a href="${rejectUrl}" style="background: #dc3545; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 16px;">
                ❌ Reject
              </a>
            </div>

            <p style="font-size: 14px; color: #555;">
              Please confirm or reject this appointment at your earliest convenience.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p style="margin: 0;">© ${new Date().getFullYear()} HMS. All rights reserved.</p>
          </div>

        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendEmailRejection = async (
  email: string,
  patientName: string,
  doctorName: string,
  startsAt: Date,
  endsAt: Date
) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const startFormatted = startsAt.toLocaleString("en-US", options);
  const endFormatted = endsAt.toLocaleString("en-US", options);

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: "❌ HMS - Appointment Rejected",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #dc3545, #a71d2a); padding: 20px; text-align: center; color: #fff;">
            <h1 style="margin: 0; font-size: 22px;">Appointment Rejected</h1>
          </div>

          <!-- Body -->
          <div style="padding: 30px; color: #333;">
            <p style="font-size: 16px;">Hello <b>${patientName}</b> 👋,</p>
            <p style="font-size: 16px;">
              Unfortunately, your appointment with <b>Dr. ${doctorName}</b> 
              scheduled from <b>${startFormatted}</b> to <b>${endFormatted}</b> has been <b>rejected</b>.
            </p>

            <p style="font-size: 14px; color: #555;">
              Please try booking another time slot.  
              If you have any questions, feel free to contact us.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p style="margin: 0;">© ${new Date().getFullYear()} HMS. All rights reserved.</p>
          </div>

        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


