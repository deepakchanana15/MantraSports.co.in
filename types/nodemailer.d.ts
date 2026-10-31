// Type shim for nodemailer v7 — v7 ships its own types but
// they may not be auto-resolved in all setups. This module
// declaration augments the resolution so TypeScript accepts
// the import without requiring @types/nodemailer.
declare module 'nodemailer' {
  interface TransportOptions {
    host?: string
    port?: number
    secure?: boolean
    auth?: { user: string; pass: string }
    tls?: { rejectUnauthorized?: boolean }
    [key: string]: unknown
  }

  interface SendMailOptions {
    from?: string
    to?: string | string[]
    subject?: string
    html?: string
    text?: string
    replyTo?: string
    [key: string]: unknown
  }

  interface Transporter {
    sendMail(options: SendMailOptions): Promise<{ messageId: string; [key: string]: unknown }>
    verify(): Promise<true>
  }

  function createTransport(options: TransportOptions): Transporter
  export = { createTransport }
}
