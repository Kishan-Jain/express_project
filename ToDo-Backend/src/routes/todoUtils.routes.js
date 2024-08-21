import { Router } from "express";
import { isLogin } from "../middlewares/auth.middleware.js";
import { addNewTodo, markToComplete, markToUnComplete, removeTodo, updateTodo } from "../controllers/todo.controller.js";


const todoUtilsRouter = Router()

todoUtilsRouter.route("/addNewTodo").post(isLogin, addNewTodo)
todoUtilsRouter.route("/updateTodo/:todoId").post(isLogin, updateTodo)
todoUtilsRouter.route("/markToComplete/:todoId").post(isLogin, markToComplete)
todoUtilsRouter.route("/markToUnComplete/:todoId").post(isLogin, markToUnComplete)
todoUtilsRouter.route("/removeTodo/:todoId").post(isLogin, removeTodo)



export default todoUtilsRouter