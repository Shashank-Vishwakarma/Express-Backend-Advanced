import nodemailer from 'nodemailer';
import { ENV_VARS } from "../utils/envVariables.js";

const transporter = nodemailer.createTransport({
    host: ENV_VARS.SMTP_RESEND_HOST,
    port: ENV_VARS.SMTP_RESEND_PORT,
    secure: true,
    auth: {
        user: ENV_VARS.SMTP_RESEND_USER,
        pass: ENV_VARS.SMTP_RESEND_PASSWORD,
    }
});

export async function sendEmail({ to, subject, html }) {
    try {
        const email = await transporter.sendMail({
            from: ENV_VARS.SENDER_EMAIL,
            to, subject, html
        });

        return { messageId: email.messageId };
    } catch (error) {
        return { error: error.message };
    }
}
