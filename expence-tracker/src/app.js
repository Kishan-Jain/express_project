import express from "express"
import cookie from "cookie-parser"
import userRouter from "./routes/userUtils.routes.js"
import expenceRouter from "./routes/expence.routes.js"
import viewsRouter from "./routes/viewsRoute.routes.js"
import { homePage } from "./controllers/views.controllers.js"

const app = express()

app.use(express.json({limit:"8kb"}))
app.use(express.urlencoded({extended:true, limit:"8kb"}))
app.use(express.static("public"))
app.use(cookie())

app.set("view engine", "ejs")
app.set("views", "./src/views")

app.use("/backend/user", userRouter)
app.use("/backend/expence", expenceRouter)
app.use("/user", viewsRouter)

app.get("/", homePage)

export default app