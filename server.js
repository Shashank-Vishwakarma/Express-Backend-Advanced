import express from 'express'
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import { ENV_VARS } from './utils/envVariables.js'
import prisma from './database/db.config.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import { authMiddleware } from './middlewares/verifyToken.js';
import newsRouter from './routes/newsRoutes.js';

const app = express();

// parse req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// parse req.cookies
app.use(cookieParser())

// parse req.files
app.use(fileUpload({
    limits: {
        fileSize: 3 * 1024 * 1024 // 3 mb file size
    }
}));

// serve static files
app.use(express.static("public"))

// auth routes
app.use("/api/auth", authRouter);

// user routes
app.use("/api/user", authMiddleware, userRouter);

// news routes
app.use("/api/news", authMiddleware, newsRouter);

app.listen(ENV_VARS.PORT, async () => {
    console.log(`Server running on port ${ENV_VARS.PORT}`);
    await prisma.$connect();
    console.log("Connected to the database");
})
