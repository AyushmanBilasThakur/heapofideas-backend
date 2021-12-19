import e, { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const validationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = validationResult(req);
        if(result.array().length > 0){
            return res.status(400).json({
                message: "Bad fromatted request",
                error: result.array()
            })
        } 
        else {
            return next();
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

export default validationMiddleware