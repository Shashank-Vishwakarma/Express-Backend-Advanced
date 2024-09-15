import { Queue } from 'bullmq'
import { redis } from '../redis/redis.config.js';
import { logger } from '../logger/logger.js'

const EMAIL_QUEUE = "emails";

const emailQueue = new Queue(EMAIL_QUEUE, {
    connection: redis,
    defaultJobOptions: {
        delay: 5000,
        removeOnComplete: true,
    }
})

export async function addEmailToQueue({ to, subject, html }) {
    const response = await emailQueue.add(EMAIL_QUEUE, { to, subject, html });
    if (response?.id) {
        logger.log({ level: "info", message: `Email added to queue: ${response.id}` });
    } else {
        logger.log({ level: "error", message: `Could not add email to queue` });
    }
}