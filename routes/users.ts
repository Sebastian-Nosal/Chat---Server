import * as express from "express";
import userController from "../controllers/user.controller.js";

const userRouter = express.Router();
userRouter.use((req,res,next)=>{
    console.log(req.body);
    next()
})
//@ts-ignore
userRouter.get('/users/:id',userController.get);
//@ts-ignore
userRouter.get('/users/',userController.get);
//@ts-ignore
userRouter.post('/users/',userController.post);
//@ts-ignore
userRouter.patch('/users/:id',userController.patch);
//@ts-ignore
userRouter.delete('/users/:id',userController.delete)

export default userRouter;