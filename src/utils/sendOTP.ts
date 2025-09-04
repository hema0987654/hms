import nodemailer from "nodemailer";

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

