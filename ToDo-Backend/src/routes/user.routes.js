// this routes for front end routes

/**
 * register page
 * login page
 * update user page
 * change password page
 * reset password page
 * find userName page
 * 
 * profile page 
 */

import { Router } from "express";
import { changePasswordPage, findUserNamePage, loginUserPage, registerUserPage, resetPasswordPage, updateUserPage, userProfilePage } from "../controllers/main.controller.js"
import {ifAlReadyLogin, isLogin} from "../middlewares/auth.middleware.js"

const userRouter = Router()

userRouter.route("/register").get(ifAlReadyLogin, registerUserPage)
userRouter.route("/login").get(ifAlReadyLogin, loginUserPage)
userRouter.route("/updatedUser").get(isLogin, updateUserPage)
userRouter.route("/changeUserPassword").get(isLogin, changePasswordPage)
userRouter.route("/resetUserPassword").get(ifAlReadyLogin, resetPasswordPage)
userRouter.route("/findUserName").get(ifAlReadyLogin, findUserNamePage)

userRouter.route("/profile").get(isLogin, userProfilePage)

export default userRouter