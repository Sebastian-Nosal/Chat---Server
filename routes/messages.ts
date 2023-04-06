import * as express from "express";
import messageController from "../controllers/message.controller.js";

const messageRouter = express.Router();
//@ts-ignore
messageRouter.get('/messages/:id',messageController.get);
//@ts-ignore
messageRouter.get('/messages/',messageController.get);
//@ts-ignore
messageRouter.post('/messages/',messageController.post);
//@ts-ignore
messageRouter.patch('/messages/:id',messageController.patch);
//@ts-ignore
messageRouter.delete('/messages/:id',messageController.delete)

export default messageRouter;