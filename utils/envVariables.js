import 'dotenv/config'

export const ENV_VARS = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET,
    APP_URL: process.env.APP_URL,
    SMTP_RESEND_HOST: process.env.SMTP_RESEND_HOST,
    SMTP_RESEND_PORT: process.env.SMTP_RESEND_PORT,
    SMTP_RESEND_USER: process.env.SMTP_RESEND_USER,
    SMTP_RESEND_PASSWORD: process.env.SMTP_RESEND_PASSWORD,
    SENDER_EMAIL: process.env.SENDER_EMAIL
}