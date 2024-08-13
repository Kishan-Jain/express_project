import { Router } from "express";
import {ifAlReadyLogin, isLogin} from "../middlewares/auth.middleware.js"
import { changePassword, deleteUser, findUserName, loginUser, logoutUser, registerUser, resetPassword, updatedUser } from "../controllers/user.controller.js";

const userUtilsRouter = Router()

// route with AlreadyLogin check
userUtilsRouter.route("/register").post(ifAlReadyLogin, registerUser)
userUtilsRouter.route("/login").post(ifAlReadyLogin, loginUser)

// route with login check
userUtilsRouter.route("/logout/userId").post(isLogin, logoutUser)
userUtilsRouter.route("/updateUser/:userId").post(isLogin, updatedUser)
userUtilsRouter.route("/deleteUser/:userId").post(isLogin, deleteUser)
userUtilsRouter.route("/changePassword/:userId").post(isLogin, changePassword)

// route withOut any check
userUtilsRouter.route("/resetPassword").post(resetPassword)
userUtilsRouter.route("/findUserName").post(findUserName)


export default userUtilsRouter