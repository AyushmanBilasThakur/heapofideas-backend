import { Document } from "mongoose";

export interface UserInterface extends Document{
    username: string,
    email: string,
    password: string,
    googleId?: string,
    otp?: string,
    isBanned: boolean,
    isVerified: boolean,
    verificationCode: String,
    validatePassword(password: string): boolean
}