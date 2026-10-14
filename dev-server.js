const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from current directory
app.use(express.static(__dirname));

/**
 * Configure Nodemailer Transporter
 * By default, uses environment variables EMAIL_USER and EMAIL_PASS (Google App Password)
 * If not configured, uses a pre-configured SMTP or safe fallback.
 */
function createTransporter() {
  const emailUser = process.env.EMAIL_USER || 'balatharun64@gmail.com';
  const emailPass = process.env.EMAIL_PASS; // 16-character Gmail App Password

  if (emailPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });
  }

  // Fallback transporter (e.g. for local testing or custom SMTP)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER || 'demo',
      pass: process.env.SMTP_PASS || 'demo'
    }
  });
}

/**
 * POST /api/send-email
 * Receives contact form payload and delivers it directly to balatharun64@gmail.com
 */
app.post('/api/send-email', async (req, res) => {
  const { name, email, subject, inquiryType, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Please provide all required fields: Name, Email, and Message.'
    });
  }

  try {
    const transporter = createTransporter();
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'balatharun64@gmail.com';

    // HTML Email template for recipient
    const mailOptions = {
      from: `"${name} (Portfolio Inquiry)" <${process.env.EMAIL_USER || 'balatharun64@gmail.com'}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `[Portfolio Inquiry - ${inquiryType || 'General'}] ${subject || 'New Message'} - from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nInquiry Type: ${inquiryType}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #334155;">
          <div style="background: linear-gradient(135deg, #0284c7, #6366f1); padding: 24px; text-align: center;">
            <h2 style="margin: 0; color: #ffffff; font-size: 22px;">New Portfolio Inquiry</h2>
            <p style="margin: 6px 0 0 0; color: #e0f2fe; font-size: 14px;">Received via Balasubaramani T's Portfolio</p>
          </div>
          <div style="padding: 24px; background: #1e293b;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #94a3b8; width: 130px; font-weight: bold;">Sender Name:</td>
                <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0; color: #38bdf8;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Inquiry Type:</td>
                <td style="padding: 8px 0; color: #34d399; font-weight: bold;">${inquiryType || 'General'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #94a3b8; font-weight: bold;">Subject:</td>
                <td style="padding: 8px 0; color: #ffffff;">${subject || 'No subject provided'}</td>
              </tr>
            </table>

            <div style="border-top: 1px solid #334155; padding-top: 18px;">
              <h4 style="margin: 0 0 10px 0; color: #94a3b8; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Message Content:</h4>
              <div style="background: #0f172a; padding: 16px; border-radius: 8px; border-left: 4px solid #38bdf8; color: #f1f5f9; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            </div>
          </div>
          <div style="padding: 16px; text-align: center; background: #090d16; font-size: 12px; color: #64748b;">
            You can reply directly to this email to respond to ${name} (${email}).
          </div>
        </div>
      `
    };

    // If Google App Password is provided, send through Nodemailer
    if (process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({
        success: true,
        message: 'Your email has been sent successfully to Balasubaramani T!'
      });
    } else {
      console.log(`[Node Server] EMAIL_PASS not set in .env. Delegating to direct cloud delivery for ${name} (${email})`);
      return res.status(200).json({
        success: false,
        useCloudFallback: true,
        message: 'EMAIL_PASS not set in .env. Frontend will use direct cloud email delivery.'
      });
    }

  } catch (error) {
    console.error('Nodemailer Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to dispatch email via Nodemailer. ' + error.message
    });
  }
});

// Fallback route for SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Balasubaramani T Portfolio Server running at http://localhost:${PORT}`);
  console.log(`📧 Nodemailer API endpoint active at http://localhost:${PORT}/api/send-email`);
});
