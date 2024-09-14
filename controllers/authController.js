import vine, { errors } from "@vinejs/vine";
import bcrypt from 'bcryptjs'
import { loginSchemaValidation, registerSchemaValidation } from "../schema/authSchemaValidation.js";
import prisma from "../database/db.config.js";
import { generateToken } from "../utils/generateToken.js";

class AuthController {
    static async register(req, res) {
        try {
            const body = req.body;

            const { name, email, password } = await vine.validate({
                schema: registerSchemaValidation,
                data: body
            });

            // check if user exists
            const user = await prisma.users.findUnique({ where: { email } });
            if (user) {
                return res.status(400).json({
                    error: "User already exists"
                })
            }

            const newUser = await prisma.users.create({
                data: { name, email, password: await bcrypt.hash(password, 10) }
            });

            return res.status(201).json({
                success: true,
                message: "User successfully registered",
                user: {
                    name: newUser.name,
                    email: newUser.email,
                    profileImage: newUser?.profileImage
                }
            });
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({
                    errors: error.messages
                });
            }

            console.log("Error in register: ", error);
            return res.status(500).json({
                error: "Internal server error"
            });
        }
    }

    static async login(req, res) {
        try {
            const body = req.body;

            const { email, password } = await vine.validate({
                schema: loginSchemaValidation,
                data: body
            });

            const user = await prisma.users.findUnique({ where: { email } });
            if (!user) {
                return res.status(404).json({
                    error: "User does not exist"
                })
            }

            // verify password
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({
                    error: "Incorrect password"
                })
            }

            // generate a token for authorization
            const token = generateToken(user.id);

            const cookieOptions = {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            }

            return res.status(200).cookie('token', token, cookieOptions).json({
                success: true,
                message: "User successfully logged in",
                user: {
                    name: user.name,
                    email,
                    profileImage: user?.profileImage
                },
                token
            });
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({
                    errors: error.messages
                });
            }

            console.log("Error in login: ", error);
            return res.status(500).json({
                error: "Internal server error"
            });
        }
    }

    static async logout(req, res) {
        res.clearCookie('token', { maxAge: 0 });
        return res.status(200).json({
            success: true,
            message: "User successfully logged out"
        });
    }
}

export default AuthController;