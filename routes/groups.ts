import * as express from "express";
import groupController from "../controllers/group.controller.js";

const groupRouter = express.Router();

//@ts-ignore
groupRouter.get('/groups/:id',groupController.get);
//@ts-ignore
groupRouter.get('/groups/',groupController.get);
//@ts-ignore
groupRouter.post('/groups/',groupController.post);
//@ts-ignore
groupRouter.patch('/groups/:id',groupController.patch);
//@ts-ignore
groupRouter.delete('/groups/:id',groupController.delete);

export default groupRouter;