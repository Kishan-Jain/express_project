import { Router } from "express";
import {ifAlReadyLogin, isLogin} from "../middlewares/auth.middlewares.js"
import { addNewExpence, changeUserPasswordPage, loginUserPage, registerUserPage, resetUserPasswordPage, updateExpence, updateUserPage, userDetails, userProfile, viewPerticulerExpence } from "../controllers/views.controllers.js";
const viewRouter = Router()

viewRouter.route("/register").get(ifAlReadyLogin, registerUserPage)
viewRouter.route("/login").get(ifAlReadyLogin, loginUserPage)
viewRouter.route("/resetUserPassword").get(ifAlReadyLogin, resetUserPasswordPage)
viewRouter.route("/userProfile/updateUser/:userId").get(isLogin, updateUserPage)
viewRouter.route("/userProfile/changeUserPassword/:userId").get(isLogin, changeUserPasswordPage)

viewRouter.route("/userProfile").get(isLogin, userProfile)
viewRouter.route("/userProfile/userDetails/:userId").get(isLogin, userDetails)

viewRouter.route("/userProfile/addNewExpence").get(isLogin, addNewExpence)
viewRouter.route("/userProfile/updateExpence/:expenceId").get(isLogin, updateExpence)
viewRouter.route("/userProfile/expence/:expenceId").get(isLogin, viewPerticulerExpence)

export default viewRouter