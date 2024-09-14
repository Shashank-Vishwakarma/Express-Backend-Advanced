import express from 'express'
import UserController from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get("/", UserController.getUserDetails);
userRouter.put("/update/:id", UserController.updateProfile);

export default userRouter;