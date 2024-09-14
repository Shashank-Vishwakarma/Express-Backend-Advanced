import express from 'express'
import cookieParser from 'cookie-parser';

import { ENV_VARS } from './utils/envVariables.js'
import prisma from './database/db.config.js';
import authRouter from './routes/authRoutes.js';

const app = express();

// parse req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// parse req.cookies
app.use(cookieParser())

// routes
app.use("/api/auth", authRouter);

app.listen(ENV_VARS.PORT, async () => {
    console.log(`Server running on port ${ENV_VARS.PORT}`);
    await prisma.$connect();
    console.log("Connected to the database");
})
