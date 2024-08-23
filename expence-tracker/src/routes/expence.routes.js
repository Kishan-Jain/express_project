import { Router } from "express";
import {isLogin} from "../middlewares/auth.middlewares.js"
import { addNewExpence, removeExpence, updateExpence } from "../controllers/expence.controllers.js";

const expenceRouter = Router()

expenceRouter.route("/addNewExpence").post(isLogin, addNewExpence)
expenceRouter.route("/updateExpence/:userId/:expenceId").post(isLogin, updateExpence)
expenceRouter.route("/removeExpence/:userId/:expenceId").post(isLogin, removeExpence)

export default expenceRouter
