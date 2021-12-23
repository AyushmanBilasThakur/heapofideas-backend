import { Router } from "express";
import { body } from "express-validator";
import validationMiddleware from "../midddlewares/validationMiddleware";
import * as authController from "../controllers/authController";
import authMiddleware, { authWithoutVerify } from "../midddlewares/authMiddleware";

const authRouter = Router();

authRouter.post(
    "/checkusername",
    body("username").notEmpty(),
    validationMiddleware,
    authController.checkUsername
)

authRouter.post(
    "/create/email-and-password",
    body("username").notEmpty(),
    body("email").isEmail(),
    body("password").notEmpty(),
    validationMiddleware,
    authController.createUserWithEmailAndPassword
)

authRouter.post(
    "/create/google",
    body("token").notEmpty(),
    validationMiddleware,
    authController.createUserWithGoogle
)

authRouter.post(
    "/login/email-and-password",
    body("email").isEmail(),
    body("password").notEmpty(),
    validationMiddleware,
    authController.loginWithEmailAndPassword
)

authRouter.post(
    "/login/username-and-password",
    body("username").notEmpty(),
    body("password").notEmpty(),
    validationMiddleware,
    authController.loginWithUsernameAndPassword
)

authRouter.get(
    "/logout",
    authController.signOut
)

authRouter.post(
    "/verify",
    body('token').notEmpty(),
    validationMiddleware,
    authController.verifyUser
)

authRouter.post(
    '/resend-verification',
    authWithoutVerify,
    authController.resendVerificationCode
)

authRouter.post(
    '/reset-password-request',
    body('email').isEmail(),
    validationMiddleware,
    authController.resetRequest
)

authRouter.post(
    '/reset-password',
    body('newPassword').notEmpty(),
    body('token').notEmpty(),
    validationMiddleware,
    authController.resetPassword
)

authRouter.post(
    '/update-password',
    body('currentPassword').notEmpty(),
    body('newPassword').notEmpty(),
    validationMiddleware,
    authMiddleware,
    authController.updatePassword
)

authRouter.get(
    '/user',
    authWithoutVerify,
    authController.getUser
)

authRouter.get(
    '/refresh',
    authController.refresh
)

export default authRouter;