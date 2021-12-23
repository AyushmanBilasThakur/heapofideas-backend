import { Request, Response } from "express";
import Idea from "../models/Idea";

export const createIdea = async(req: Request, res: Response) => {
    try {
        const idea = new Idea({
            ...req.body,
            createdBy: res.locals.user_id
        })

        await idea.save();
        
        return res.json({
            message: "Idea creation successful",
            data: idea
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong in the server!"
        })
    }
}

export const getIdeabyId = async(req: Request, res: Response) => {
    try {
        const {id} = req.params; 
        const idea = await Idea.findById(id);
        
        return res.json({
            message: "Idea found",
            data: idea
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong in the server!"
        })
    }
}

export const getIdeas = async(req: Request, res: Response) => {
    try {

        let { filter } = req.query

        let {page, count}: any = req.query;
        if(!page) page = 0
        if(!count) count = 10

        let ideas;

        if(filter){
            ideas = await Idea.find({tags: {"$in": filter}, isPublic: true}).sort({createdAt: -1}).skip(page * count).limit(count);
        }
        else{
                    ideas = await Idea.find({isPublic: true}).sort({createdAt: -1}).skip(page * count).limit(count);
        }
        
        return res.json({
            message: "Ideas fetched",
            data: ideas,
            page,
            count
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong in the server!"
        })
    }
}


export const getMyIdeas = async(req: Request, res: Response) => {
    try {
        let {page, count}: any = req.query;
        if(!page) page = 0
        if(!count) count = 10

        const ideas = await Idea.find({createdBy: res.locals.user_id}).sort({created_at: -1}).skip(page * count).limit(count);
        
        return res.json({
            message: "Ideas fetched",
            data: ideas,
            page,
            count
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong in the server!"
        })
    }
}



export const updateIdea = async(req: Request, res: Response) => {
    try {
        const {id} = req.body; 
        const idea = await Idea.findById(id);
        
        if(!idea){
            return res.status(404).json({
                message: "Idea not found!"
            })
        }

        if(idea.createdBy != res.locals.user_id){
            res.status(400).json({
                message: "You can't access other person's idea"
            });
        }

        const updatedIdea = await Idea.findByIdAndUpdate(id, req.body, {new: true});

        return res.json({
            message: "Idea updated",
            data: updatedIdea
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong in the server!"
        })
    }
}


export const deleteIdea = async(req: Request, res: Response) => {
    try {
        const {id} = req.body; 
        const idea = await Idea.findById(id);
        
        if(!idea){
            return res.status(404).json({
                message: "Idea not found!"
            })
        }

        if(idea.createdBy != res.locals.user_id){
            res.status(400).json({
                message: "You can't delete other person's idea"
            });
        }

        await Idea.findByIdAndDelete(id, req.body);

        return res.json({
            message: "Idea deleted",
            data: idea
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong in the server!"
        })
    }
}