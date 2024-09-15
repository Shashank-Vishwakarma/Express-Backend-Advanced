import prisma from "../database/db.config.js";
import { logger } from "../logger/logger.js";
import { generateUniqueFileName } from "../utils/generateUniqueFileName.js";
import { validateImage } from "../utils/validateImage.js";

class UserController {
    static async getUserDetails(req, res) {
        try {
            return res.status(200).json({
                success: true,
                user: req.user
            });
        } catch (error) {
            logger.log({ level: "error", message: `Error in getUserDetails: ${error}` });
            return res.status(500).json({
                error: "Internal server error"
            });
        }
    }

    static async updateProfile(req, res) {
        try {
            const { id } = req.params;

            const user = await prisma.users.findUnique({ where: { id: parseInt(id) } });
            if (!user) {
                return res.status(404).json({
                    error: "User not found"
                })
            }

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({
                    error: "No file provided"
                })
            }

            const profileImage = req.files.profileImage;

            const { error } = validateImage(profileImage.mimetype);
            if (error !== null) return res.status(400).json({ error });

            const fileName = generateUniqueFileName(profileImage.name);
            const uploadPath = process.cwd() + "/public/images/" + fileName;
            profileImage.mv(uploadPath);

            // save the uploadPath in database as needed
            await prisma.users.update({
                where: { id: parseInt(id) },
                data: {
                    profileImage: ENV_VARS.APP_URL + "/images/" + fileName,
                }
            })

            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                profileImage: ENV_VARS.APP_URL + "/images/" + fileName
            });
        } catch (error) {
            logger.log({ level: "error", message: `Error in updateProfile: ${error}` });
            return res.status(500).json({
                error: "Internal server error"
            });
        }
    }
}

export default UserController;