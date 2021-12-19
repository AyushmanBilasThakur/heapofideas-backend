import { compareSync, hashSync } from "bcryptjs";
import { model, Schema } from "mongoose";
import { UserInterface } from "../interface/UserInterface";

const UserSchema: Schema<UserInterface> = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    googleId: {
        type: String
    },
    otp: {
        type: String,
        default: ""
    },
    isBanned:{
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        default: ""
    }
})


UserSchema.pre("save", function(next){
    this.password = hashSync(this.password),
    next();
})

UserSchema.methods.validatePassword = function(password: string) {
    return compareSync(password, this.password);
}

const User = model("User", UserSchema);
export default User;