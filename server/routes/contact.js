import { Router } from 'express'
import nodemailer from 'nodemailer'

const router = Router()

const EMAIL_FROM = 'eaglerahul115@gmail.com'
const EMAIL_TO = 'kapil302424@gmail.com'
const APP_PASSWORD = 'YOUR_16_CHAR_APP_PASSWORD_HERE'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_FROM,
    pass: APP_PASSWORD
  }
})

router.post('/', async (req, res) => {
  const { name, email, phone, course, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' })
  }

  const mailOptions = {
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject: `New Enquiry from ${name} - Success Academy`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 12px;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h2 style="color: #fff; margin: 0;">New Student Enquiry</h2>
        </div>
        <div style="background: #fff; padding: 24px; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Name</td>
              <td style="padding: 10px 0; color: #111827;">${name}</td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Email</td>
              <td style="padding: 10px 0; color: #111827;"><a href="mailto:${email}" style="color: #6366f1;">${email}</a></td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Phone</td>
              <td style="padding: 10px 0; color: #111827;">${phone || 'Not provided'}</td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Interested Course</td>
              <td style="padding: 10px 0; color: #111827;">${course || 'Not specified'}</td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="padding: 10px 0; color: #6b7280; font-weight: 600; vertical-align: top;">Message</td>
              <td style="padding: 10px 0; color: #111827;">${message}</td>
            </tr>
          </table>
        </div>
        <div style="text-align: center; padding: 16px; color: #9ca3af; font-size: 12px;">
          Sent from Success Academy Contact Form
        </div>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    res.json({ success: true, message: 'Your enquiry has been submitted successfully. We will contact you soon!' })
  } catch (error) {
    console.error('Email error:', error)
    if (error.code === 'EAUTH') {
      return res.status(500).json({ error: 'Email configuration error. Please check app password.' })
    }
    res.status(500).json({ error: 'Failed to send email. Please try again later.' })
  }
})

export default router
