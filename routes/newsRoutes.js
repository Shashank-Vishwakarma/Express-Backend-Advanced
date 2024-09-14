import express from 'express'
import NewsController from '../controllers/newsController.js';

const newsRouter = express.Router();

newsRouter.post('/create', NewsController.createNews);
newsRouter.get('/all', NewsController.getAllNews);
newsRouter.get('/:id', NewsController.getNewsbyId);
newsRouter.put('/update/:id', NewsController.updateNews);
newsRouter.delete('/delete/:id', NewsController.deletedNews);

export default newsRouter;