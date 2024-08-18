import { Router } from "express";
import {isLogin} from "../middlewares/auth.middlewares.js"
import { addNewExpence, removeExpence, updateExpence, viewAllExpence, viewExpence } from "../controllers/exprence.controllers";

const expenceRouter = Router()

expenceRouter.route("/addNewExpence").post(isLogin, addNewExpence)
expenceRouter.route("/viewAllExpence").post(isLogin, viewAllExpence)
expenceRouter.route("/viewExpence/:exprenceId").post(isLogin, viewExpence)
expenceRouter.route("/updateExprence/:expenceId").post(isLogin, updateExpence)
expenceRouter.route("/removeExpence/:expenceId").post(isLogin, removeExpence)

export default expenceRouter
