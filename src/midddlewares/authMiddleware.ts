import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import User from "../models/User";

export const authWithoutVerify = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];

        if(!accessToken){
            return res.status(400).json({
                message: "No Accesstoken found"
            })
        }

        const decoded: any = jwt.verify(accessToken, String(process.env.ACCESS_TOKEN_SECRET));

        const {id} = decoded;
        
        res.locals.user_id = id;
        next();

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}


const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];

        if(!accessToken){
            return res.status(400).json({
                message: "No Accesstoken found"
            })
        }

        const decoded: any = jwt.verify(accessToken, String(process.env.ACCESS_TOKEN_SECRET));

        const {id} = decoded;
        const user = await User.findById(id);
        if(user && !user.isVerified){
            return res.json({
                message: "Please verify first"
            })
        }

        if(user?.isBanned){
            return res.json({
                message: "This user is banned"
            })
        }

        res.locals.user_id = id;
        next();

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong!"
        })
    }
}

export default authMiddleware;