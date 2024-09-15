import { Worker } from 'bullmq'
import { redis } from '../redis/redis.config.js';
import { logger } from '../logger/logger.js'

const EMAIL_QUEUE = "emails";

const worker = new Worker(EMAIL_QUEUE, async (email) => {
    const { to, subject, html } = email.data;
    const response = await sendEmail({ to, subject, html });

    if (response?.error) {
        logger.log({ level: "error", message: `Could not send email to ${to}: ${response?.error}` });
    } else {
        logger.log({ level: "info", message: `Email sent to ${to}: ${response?.messageId}` });
    }
}, { connection: redis });

worker.on("completed", async (job) => {
    logger.log({ level: "info", message: `Email sent to ${job.data.to}` });
})

worker.on("failed", async (job) => {
    logger.log({ level: "error", message: `Could not send email to ${job.data.to}: ${job.failedReason}` });
})

