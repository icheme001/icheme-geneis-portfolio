// app/(lib)/emailService.ts
import nodemailer from 'nodemailer';

// Create transporter with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (NOT your regular password)
  },
});

// Interface for contact form data
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Send notification email to admin
export async function sendContactNotification(data: ContactFormData) {
  try {
    const { name, email, message } = data;

    // Email to YOU (the admin)
    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER, // Your email
      subject: `🔔 New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .info-box {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #667eea;
            }
            .label {
              font-weight: bold;
              color: #667eea;
              margin-bottom: 5px;
            }
            .value {
              color: #333;
              margin-bottom: 15px;
            }
            .message-box {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border: 1px solid #e0e0e0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
            }
            .btn {
              display: inline-block;
              padding: 12px 30px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📬 New Contact Message</h1>
            <p>You have received a new message from your portfolio</p>
          </div>
          
          <div class="content">
            <div class="info-box">
              <div class="label">👤 From:</div>
              <div class="value">${name}</div>
              
              <div class="label">📧 Email:</div>
              <div class="value">
                <a href="mailto:${email}">${email}</a>
              </div>
              
              <div class="label">📅 Received:</div>
              <div class="value">${new Date().toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</div>
            </div>
            
            <div class="message-box">
              <div class="label">💬 Message:</div>
              <p style="white-space: pre-wrap; margin-top: 10px;">${message}</p>
            </div>
            
            <center>
              <a href="mailto:${email}" class="btn">Reply to ${name}</a>
            </center>
          </div>
          
          <div class="footer">
            <p>This email was sent from your portfolio contact form</p>
            <p>Manage messages in your <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/messages">Admin Dashboard</a></p>
          </div>
        </body>
        </html>
      `,
      // Plain text version for email clients that don't support HTML
      text: `
New Contact Form Submission

From: ${name}
Email: ${email}
Date: ${new Date().toLocaleString()}

Message:
${message}

---
Reply to: ${email}
View in dashboard: ${process.env.NEXT_PUBLIC_SITE_URL}/admin/messages
      `.trim(),
    };

    // Send email
    await transporter.sendMail(adminMailOptions);
    console.log('✅ Notification email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error };
  }
}

// Optional: Send auto-reply to the person who contacted you
export async function sendAutoReply(data: ContactFormData) {
  try {
    const { name, email } = data;

    const autoReplyOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Thank you for contacting me!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✉️ Message Received!</h1>
          </div>
          
          <div class="content">
            <p>Hi ${name},</p>
            
            <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
            
            <p>I typically respond within 24-48 hours during business days.</p>
            
            <p>Best regards,<br><strong>Your Name</strong></p>
          </div>
          
          <div class="footer">
            <p>This is an automated response from my portfolio contact form</p>
          </div>
        </body>
        </html>
      `,
      text: `
Hi ${name},

Thank you for reaching out! I've received your message and will get back to you as soon as possible.

I typically respond within 24-48 hours during business days.

Best regards,
Icheme Genesis Ojochegbe
      `.trim(),
    };

    await transporter.sendMail(autoReplyOptions);
    console.log('✅ Auto-reply sent successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending auto-reply:', error);
    return { success: false, error };
  }
}

// Test email configuration
export async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready');
    return true;
  } catch (error) {
    console.error('❌ Email server error:', error);
    return false;
  }
}