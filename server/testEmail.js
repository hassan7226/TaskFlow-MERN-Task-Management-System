import dotenv from "dotenv";
import transporter from "./config/nodemailer.js";

dotenv.config();

const testEmail = async () => {
  console.log("Testing email configuration...");
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_PASS:", process.env.SMTP_PASS ? "Loaded" : "Missing");
  
  try {
    // Verify transporter configuration
    await transporter.verify();
    console.log("✓ SMTP server connection verified successfully");
    
    // Send a test email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: "itshuraira398@gmail.com", // Change to your test email
      subject: "TaskFlow Email Test",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📧 Email Test</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              This is a test email from TaskFlow to verify SMTP configuration.
            </p>
            <p style="color: #555; font-size: 14px;">
              If you receive this email, the SMTP configuration is working correctly.
            </p>
          </div>
        </div>
      `
    };
    
    console.log("Sending test email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("✓ Test email sent successfully!");
    console.log("  Message ID:", info.messageId);
    console.log("  Response:", info.response);
    
  } catch (error) {
    console.error("✗ Email test failed:", error);
    console.error("  Error code:", error.code);
    console.error("  Error message:", error.message);
  }
};

testEmail();
