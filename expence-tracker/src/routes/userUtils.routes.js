import { Router } from "express";
import {ifAlReadyLogin, isLogin} from "../middlewares/auth.middlewares.js"
import { changeUserPassword, deleteUser, loginUser, logoutUser, registerUser, resetUserPassword, updateUserDetails } from "../controllers/user.controllers.js";

const userRouter = Router()

// route with check login not login: for register, login and password reset
userRouter.route("/registerUser").post(ifAlReadyLogin, registerUser)
userRouter.route("/loginUser").post(ifAlReadyLogin, loginUser)
userRouter.route("/resetUserPassword").post(ifAlReadyLogin, resetUserPassword)

// toute with check user login : for user utilities
userRouter.route("/logoutUser/:userId").post(isLogin, logoutUser)
userRouter.route("/updateUserDetails/:userId").post(isLogin, updateUserDetails)
userRouter.route("/changeUserPassword/:userId").post(isLogin, changeUserPassword)
userRouter.route("/deleteUser/:userId").post(isLogin, deleteUser)

export default userRouter