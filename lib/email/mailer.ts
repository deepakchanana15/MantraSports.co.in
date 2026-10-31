import nodemailer from 'nodemailer'

// Nodemailer v7 transporter — configured from environment variables.
// Compatible with: Gmail, Outlook, Mailgun, SendGrid, Postmark, custom SMTP.

function createTransporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT ?? '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const secure = process.env.SMTP_SECURE === 'true'

  if (!host || !user || !pass) {
    console.warn('[Mailer] SMTP not configured. Emails will not be sent.')
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: process.env.NODE_ENV === 'production' },
  })
}

interface SendMailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendMail(options: SendMailOptions): Promise<boolean> {
  const transporter = createTransporter()

  if (!transporter) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Mailer DEV] Would send email:', {
        to: options.to,
        subject: options.subject,
      })
    }
    return false
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? `"Mantra Sports NL" <noreply@mantrasports.nl>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    })
    return true
  } catch (error) {
    console.error('[Mailer] Failed to send email:', error)
    return false
  }
}
