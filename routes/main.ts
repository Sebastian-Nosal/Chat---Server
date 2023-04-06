import * as express from 'express';
import authController from '../controllers/auth.controller.js';
const mainRouter = express.Router();

mainRouter.post('/login',authController.login);
mainRouter.post('/me',authController.me);

export default mainRouter;