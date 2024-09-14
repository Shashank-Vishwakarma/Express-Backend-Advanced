import vine, { errors, Vine } from "@vinejs/vine";
import prisma from "../database/db.config.js";
import { validateImage } from "../utils/validateImage.js";
import { newsSchemaValidation } from "../schema/newsSchemavalidation.js";
import { generateUniqueFileName } from "../utils/generateUniqueFileName.js";
import { ENV_VARS } from "../utils/envVariables.js";
import fs from 'fs'

class NewsController {
    static async createNews(req, res) {
        try {
            const reqBody = req.body;

            const data = await vine.validate({
                schema: newsSchemaValidation,
                data: reqBody
            })

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({
                    error: "No file provided"
                })
            }

            const image = req.files.image;
            if (!image) {
                return res.status(400).json({
                    error: "Please uplaod an image for this news"
                });
            }

            const { error } = validateImage(image.mimetype);
            if (error !== null) return res.status(400).json({ error });

            const fileName = generateUniqueFileName(image.name);
            const uploadPath = process.cwd() + "/public/news/" + fileName;
            image.mv(uploadPath);

            await prisma.news.create({
                data: {
                    title: data.title,
                    body: data.body,
                    image: ENV_VARS.APP_URL + "/news/" + fileName,
                    user: { connect: { id: req.user.id } }
                }
            });

            return res.status(201).json({
                success: true,
                message: "News created successfully",
                title: data.title,
                body: data.body,
                image: ENV_VARS.APP_URL + "/news/" + fileName
            });
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({
                    errors: error.messages
                });
            }

            console.log("Error in createNews Api: ", error);
            return res.status(500).json({
                error: "Internal server error"
            });
        }
    }

    static async getAllNews(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;

            if (page <= 0) page = 1;
            if (limit <= 0 || limit > 100) limit = 5

            const offset = (page - 1) * limit;

            const news = await prisma.news.findMany({
                skip: offset,
                take: limit,
                include: {
                    user: true
                },
                orderBy: {
                    id: "asc"
                }
            });

            const totalNews = await prisma.news.count();

            return res.status(200).json({
                news,
                metadate: {
                    page,
                    total: Math.ceil(totalNews / limit)
                }
            });
        } catch (error) {
            console.log("Error in getAllNews Api: ", error);
            return res.status(500).json({
                error: "Internal server error"
            });
        }
    }

    static async getNewsbyId(req, res) {
        try {
            const { id } = req.params;
            const news = await prisma.news.findUnique({ where: { id: parseInt(id) }, include: { user: true } });
            if (!news) {
                return res.status(404).json({
                    error: "News not found"
                });
            }

            return res.status(200).json(news);
        } catch (error) {
            console.log("Error in getNewsbyId Api: ", error);
            return res.status(500).json({
                error: "Internal server error"
            });
        }
    }

    static async deletedNews(req, res) {
        try {
            const { id } = req.params;
            const news = await prisma.news.findUnique({ where: { id: parseInt(id) } });
            if (!news) {
                return res.status(404).json({
                    error: "News not found"
                });
            }

            // check if user is authorized to update
            const isUserAuthorized = req.user.id === news.userId;
            if (!isUserAuthorized) {
                return res.status(401).json({
                    error: "Not Authorized"
                });
            }

            await prisma.news.delete({ where: { id: parseInt(id) } });

            return res.status(200).json({
                success: true,
                message: "News deleted successfully"
            });
        } catch (error) {
            console.log("Error in deletedNews Api: ", error);
            return res.status(500).json({
                error: "Internal server error"
            });
        }
    }

    static async updateNews(req, res) {
        try {
            const { id } = req.params;
            const news = await prisma.news.findUnique({ where: { id: parseInt(id) } });
            if (!news) {
                return res.status(404).json({
                    error: "News not found"
                });
            }

            // check if user is authorized to update
            const isUserAuthorized = req.user.id === news.userId;
            if (!isUserAuthorized) {
                return res.status(401).json({
                    error: "Not Authorized"
                });
            }

            const { title, body } = req.body;

            const image = req.files?.image;
            let fileName = "";
            if (image) { // delete old image
                const oldImagePath = process.cwd() + "/public/news/" + news.image.split('/').pop();
                if (!fs.existsSync(oldImagePath)) {
                    return res.status(404).json({
                        error: "Image not found"
                    });
                }
                fs.rmSync(oldImagePath);

                const { error } = validateImage(image.mimetype);
                if (error !== null) return res.status(400).json({ error });

                fileName = generateUniqueFileName(image.name);
                const uploadPath = process.cwd() + "/public/news/" + fileName;
                image.mv(uploadPath);
            }

            await prisma.news.update({
                where: { id: parseInt(id) },
                data: {
                    title: title || news.title,
                    body: body || news.body,
                    image: image ? ENV_VARS.APP_URL + "/news/" + fileName : news.image
                }
            })

            return res.status(200).json({
                success: true,
                message: "News updated successfully",
                news: {
                    title: title || news.title,
                    body: body || news.body,
                    image: image ? ENV_VARS.APP_URL + "/news/" + fileName : news.image
                }
            });
        } catch (error) {
            console.log("Error in updateNews Api: ", error);
            return res.status(500).json({
                error: "Internal server error"
            });
        }
    }
}

export default NewsController;