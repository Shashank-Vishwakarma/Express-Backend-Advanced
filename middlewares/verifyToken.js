import jwt from 'jsonwebtoken'
import { ENV_VARS } from '../utils/envVariables.js'
import prisma from '../database/db.config.js'
import { logger } from '../logger/logger.js';

export async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                error: "Not Authorized"
            });
        }

        const decodedPayload = jwt.verify(token.toString(), ENV_VARS.JWT_SECRET);
        if (!decodedPayload) {
            return res.status(401).json({
                error: "Could not decode payload"
            });
        }

        req.user = await prisma.users.findUnique({ where: { id: decodedPayload.id } });
        req.user.password = null;

        next();
    } catch (error) {
        logger.log({ level: "error", message: `Error in authMiddleware: ${error}` });
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}