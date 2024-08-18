import { Router } from "express";
import {ifAlReadyLogin, isLogin} from "../middlewares/auth.middlewares.js"
import { changeUserPasswordPage, loginUserPage, registerUserPage, resetUserPasswordPage, updateUserPage } from "../controllers/views.controllers";
const viewRouter = Router()

viewRouter.route("/register").get(ifAlReadyLogin, registerUserPage)
viewRouter.route("/login").get(ifAlReadyLogin, loginUserPage)
viewRouter.route("/updateUserDetails/:userId").get(isLogin, updateUserPage)
viewRouter.route("/changeUserPassword/:userId").get(isLogin, changeUserPasswordPage)
viewRouter.route("/resetUserPassword").get(isLogin, resetUserPasswordPage)

export default viewRouter