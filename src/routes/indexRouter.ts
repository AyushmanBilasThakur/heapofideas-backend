import { Request, Response, Router } from "express";
import authRouter from "./authRouter";
import ideaRouter from "./ideaRouter";

const indexRouter = Router();

indexRouter.get("/", (req: Request, res: Response) => {
    return res.json({
        message: "API is on!"
    })
})
indexRouter.use("/ideas", ideaRouter);
indexRouter.use("/auth", authRouter);

export default indexRouter;