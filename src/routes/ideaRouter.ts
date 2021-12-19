import { Router } from "express";
import { body } from "express-validator";
import * as ideaController from "../controllers/ideaController";
import authMiddleware from "../midddlewares/authMiddleware";
import validationMiddleware from "../midddlewares/validationMiddleware";
const ideaRouter = Router();

ideaRouter.get(
    "/all",
    ideaController.getIdeas
)

ideaRouter.get(
    "/id/:id",
    ideaController.getIdeabyId
)

ideaRouter.get(
    "/my",
    authMiddleware,
    ideaController.getMyIdeas
)
ideaRouter.post(
    "/create",
    body('title').isString(),
    body('description').isString(),
    validationMiddleware,
    authMiddleware,
    ideaController.createIdea 
)

ideaRouter.post(
    "/update",
    body("id").notEmpty(),
    validationMiddleware,
    authMiddleware,
    ideaController.updateIdea
)


ideaRouter.post(
    "/delete",
    body("id").notEmpty(),
    validationMiddleware,
    authMiddleware,
    ideaController.deleteIdea
)

export default ideaRouter;