import {model, Schema} from 'mongoose';
import { IdeaInterface } from '../interface/IdeaInterface';

const IdeaSchema: Schema<IdeaInterface> = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    likeCount: {
        type: Number,
        default: 0
    },
    dislikeCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String
    }],
    isPublic: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Idea = model("Idea", IdeaSchema);

export default Idea;