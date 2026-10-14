const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, email, subject, inquiryType, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields: name, email, and message.' });
  }

  // If EMAIL_PASS is configured in Vercel Project Settings (Environment Variables):
  if (process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'balatharun64@gmail.com',
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: `"${name} (Portfolio Inquiry)" <${process.env.EMAIL_USER || 'balatharun64@gmail.com'}>`,
        to: process.env.RECIPIENT_EMAIL || 'balatharun64@gmail.com',
        replyTo: email,
        subject: `[Portfolio - ${inquiryType || 'General'}] ${subject || 'New Message'} from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nInquiry Type: ${inquiryType}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #334155;">
            <div style="background: linear-gradient(135deg, #0284c7, #6366f1); padding: 20px; text-align: center;">
              <h2 style="margin: 0; color: #ffffff;">New Portfolio Inquiry</h2>
              <p style="margin: 4px 0 0 0; color: #e0f2fe; font-size: 13px;">Received via Vercel Serverless Function</p>
            </div>
            <div style="padding: 20px; background: #1e293b;">
              <p><strong>Sender:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #38bdf8;">${email}</a></p>
              <p><strong>Type:</strong> ${inquiryType || 'General'}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <div style="background: #0f172a; padding: 14px; border-radius: 8px; border-left: 4px solid #38bdf8; margin-top: 15px;">
                ${message}
              </div>
            </div>
          </div>
        `
      });

      return res.status(200).json({
        success: true,
        message: 'Your email has been sent successfully to Balasubaramani T!'
      });
    } catch (err) {
      console.error('Vercel mail dispatch error:', err);
      return res.status(500).json({
        success: false,
        useCloudFallback: true,
        error: err.message
      });
    }
  }

  // If no password configured, gracefully instruct frontend to use cloud fallback
  return res.status(200).json({
    success: false,
    useCloudFallback: true,
    message: 'EMAIL_PASS not set in Vercel env. Delegating to direct cloud delivery.'
  });
};
