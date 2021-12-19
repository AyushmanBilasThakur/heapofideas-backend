import { Document, ObjectId } from "mongoose";

export interface IdeaInterface extends Document {
    title: string,
    description?: string,
    createdAt: any,
    updatedAt: any,
    createdBy: ObjectId,
    likeCount: number,
    dislikeCount: number,
    tags: Array<string>,
    isPublic: boolean
}