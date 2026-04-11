const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Validate environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('Email configuration is incomplete. Please check your .env file for SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.');
    }

    // Create a transporter with SMTP configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports like 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify transporter connection
    await transporter.verify();
    console.log('✓ Email transporter verified and ready');

    // Define email options
    const mailOptions = {
      from: `${process.env.FROM_NAME || 'Kiptaaz'} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('✗ Email sending failed:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
