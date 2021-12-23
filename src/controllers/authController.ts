import axios from "axios";
import { sign, verify } from "jsonwebtoken";
import { Request, response, Response } from "express";
import User from "../models/User";
import { transport } from "../utils/nodemailerInit";


export const checkUsername = async (req: Request, res: Response) => {
    try {
        const {username} = req.body;
        const UserWithSameUsername = await User.findOne({username})
        if(UserWithSameUsername){
            return res.status(400).json({
                message: "User with same username already exsists"
            })
        }
        else{
            return res.status(200).json({
                message: "Username available"
            })
        }
    } catch (error) {
        return res.status(500).json({
            messgae: "Something went wrong"
        })
    }
}

export const createUserWithEmailAndPassword = async(req: Request, res: Response) => {
    try {
        const {username, email, password} = req.body;
        const UserWithSameUsername = await User.findOne({username})
        const UserWithSameEmail = await User.findOne({email})

        if(UserWithSameUsername){
            return res.status(400).json({
                message: "User creation failed, user with same username already exsists"
            })
        }

        if(UserWithSameEmail){
            return res.status(400).json({
                message: "User creation failed, user with same email already exsists"
            })
        }

        
        
        const newUser = new User({
            username,
            email,
            password
        })
        
        await newUser.save();

        const verificationCode = sign({email}, String(process.env.VERIFICATION_TOKEN_SECRET),{expiresIn: '480s'});

        const user = await User.findByIdAndUpdate(newUser._id, {verificationCode}, {new: true});

        await transport.sendMail({
            to: req.body.email,
            from: "Heap of Ideas team <test@ayushmanbthakur.com>",
            subject: "Account activation code",
            text: `
                Hi ${req.body.username},

                Welcome to Heap of Ideas. Thanks for signing up with us. Your account needs to be verified before you can access all the functionality. Your verification code is ${process.env.BASE_CLIENT_URL + "verify/?token=" + verificationCode}
            `
        })
        res.json({
            message: "User successfully created!",
        })

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export const createUserWithGoogle = async (req: Request, res: Response) => {
    try {
        const {token} = req.body;
        let token_response = await axios.post(
                                `https://oauth2.googleapis.com/token`, 
                                 {
                                    code: token,
                                    client_id: process.env.GOOGLE_OAUTH2_CLIENT,
                                    client_secret: process.env.GOOGLE_OAUTH2_SECRET,
                                    grant_type: "authorization_code",
                                    redirect_uri: "http://localhost:8080/login",
                                 }
                            )
        
        //implement the rest of the profile

        return res.json({
            message: "User created successfully",
            data: {}
        })

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export const loginWithEmailAndPassword = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message: "Wrong email or password"
            })
        }

        if(!user.validatePassword(password)){
            return res.status(400).json({
                message: "Wrong email or password"
            })
        }

        const access_token = sign({id: user._id}, String(process.env.ACCESS_TOKEN_SECRET), {
            expiresIn: "1h"
        })

        const refresh_token = sign({id: user._id}, String(process.env.REFRESH_TOKEN_SECRET), {
            expiresIn: "30d"
        })

        res.cookie("refresh", refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })

        res.json({
            access_token,
            message: "User login successful"
        })


    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export const loginWithUsernameAndPassword = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});

        if(!user){
            return res.status(400).json({
                message: "Wrong username or password"
            })
        }

        if(!user.validatePassword(password)){
            return res.status(400).json({
                message: "Wrong username or password"
            })
        }

        const access_token = sign({id: user._id}, String(process.env.ACCESS_TOKEN_SECRET), {
            expiresIn: "1h"
        })

        const refresh_token = sign({id: user._id}, String(process.env.REFRESH_TOKEN_SECRET), {
            expiresIn: "30d"
        })

        res.cookie("refresh", refresh_token)

        res.json({
            access_token,
            message: "User login successful"
        })


    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export const verifyUser = async(req: Request, res: Response) => {
    try {
        const {token} = req.body;
        const v: any = verify(token, String(process.env.VERIFICATION_TOKEN_SECRET));

        const u = await User.findOne({email: v.email});
        
        if(!u || u.verificationCode != token){
            return res.status(400).json({
                status: "false",
                message: "We don't know this token"
            })
        }

        await User.findByIdAndUpdate(u._id, {isVerified: true, verificationCode: ""})

        return res.json({
            message: "User verification successful"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to verify user"
        })
    }
}

export const resendVerificationCode = async(req: Request, res: Response) => {
    try {
        let user = await User.findById(res.locals.user_id);

        if(!user){
            return res.status(400).json({
                status: false,
                message: "User not found",
                error: "User not found"
            })
        }

        const {email} = user;

        const verificationCode = sign({email}, String(process.env.VERIFICATION_TOKEN_SECRET), {expiresIn: '480s'});

        await User.findOneAndUpdate({email}, {
            verificationCode
        })

        await transport.sendMail({
            to: email,
            from: "Heap of Ideas Team <test@ayushmanbthakur.com>",
            subject: "Account activation code",
            text: `
            Hi ${user.username},

            Welcome to eventually. Thanks for signing up with us. Your account needs to be verified before you can access all the functionality. Your verification code is ${process.env.BASE_CLIENT_URL + "verify/?token=" + verificationCode}
            `
        })
        
        return res.json({
            status: true,
            message: "Verification code resent!"
        })   

    } catch (error) {
        return res.status(500).json({
            messsage: "Something went wrong",
        })
    }
}

export const updatePassword =  async(req: Request, res: Response) => {
    try {
        let _id = res.locals.user_id;
        let user = await User.findById(_id);

        if(!user) return res.json({status: false, message: "user not found"})
            
        let {currentPassword, newPassword} = req.body;

        if(!user.validatePassword(currentPassword)) {
            return res.status(400).json({
                status: false,
                message: "Wrong password provided"
            })
        }

        user.password = newPassword;

        await user.save();

        res.json({
            status: true,
            message: "Password updated successfully",
        })

    } catch (error) {
        return res.json({
            status: false,
            message: "Password can not be updated"
        })
    }
}

export const resetRequest = async(req: Request, res: Response) => {
    try {
        let {email} = req.body;

        let user = await User.findOne({email})

        if(!user) return res.status(400).json({
            status: false,
            message: "User not found!"
        })

        const verificationCode = sign({email}, String(process.env.VERIFICATION_TOKEN_SECRET), {expiresIn: '480s'});

        await User.findOneAndUpdate({email}, {verificationCode});

        await transport.sendMail({
            to: email,
            from: "Heap of Ideas Team <test@ayushmanbthakur.com>",
            subject: "Password Reset Code",
            text: `
                Hi ${user.username},

                 You requested a password reset for your account in Heap of Ideas. Your verification code is ${process.env.BASE_CLIENT_URL + "password-reset/?token=" + verificationCode}
            `
        })

        res.json({
            status: true,
            message: "Verification Code Sent"
        })


    } catch (error) {
        return res.json({
            status: false,
            message: "Password can not be reset"
        })
    }
}

export const resetPassword = async(req: Request, res: Response) => {
    try {
        const {token, newPassword} = req.body;
        const decode: any = verify(token, String(process.env.VERIFICATION_TOKEN_SECRET));

        const email = decode.email;

        let user = await User.findOne({email});

        if(!user || user.verificationCode != token) return res.json({status: false, message: "user not found"})

        user.password = newPassword;

        await user.save();

        res.json({
            status: true,
            message: "Password reset successful",
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: false,
            message: "Password can not be reset"
        })
    }
}

export const signOut = (req: Request, res: Response) => {
    res.cookie("refresh", "", {"maxAge": 200})
    res.json({status: true, message:"User successfully logged out"})
}

export const getUser = async (req: Request, res: Response) => {    
    try {
        let id = res.locals.user_id;

        let user = await User.findById(id);
        if(!user) return res.status(400).json({
            message: "User not found"
        })

        return res.json({
            message: "User found",
            data: user
        })
        
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong in the server",
        })
    }
}


export const refresh = async (req:Request, res:Response) => {
    try {
        let refresh_decode: any = verify(req.cookies["refresh"], String(process.env.REFRESH_TOKEN_SECRET))


        if(!refresh_decode)
            return res.status(403).json({status: false, message: "Bad Cookie"})

        let user = await User.findById(refresh_decode.id);

        if(!user)
            return res.status(403).json({status: false, message: "Bad Cookie"})

        let info = {id: refresh_decode.id}
        const access_token = sign(info, String(process.env.ACCESS_TOKEN_SECRET), {expiresIn: "1h"})
        const refresh_token = sign(info, String(process.env.REFRESH_TOKEN_SECRET), {expiresIn: "30d"})
        
        res.cookie("refresh", refresh_token, {httpOnly: true})

        return res.json({
            message: "Refreshed",
            access_token,
            user
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong in the server",
        })
    }
}