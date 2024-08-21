import express from "express"
import cookie from "cookie-parser"

const app = express()

app.use(express.json({limit:"8kb"}))
app.use(express.urlencoded({extended:true, limit:"8kb"}))
app.use(express.static("public"))
app.use(cookie())

app.set("view engine", "ejs")
app.set("views", "./src/views")

app.get("/", (req, res) => {
  res.redirect("/user/login")
})

// All routes
import userRouter from "./routes/user.routes.js"
import userUtilsRouter from "./routes/userUtils.routes.js"
import todoUtilsRouter from "./routes/todoUtils.routes.js"

app.use("/user", userRouter)
app.use("/api/users", userUtilsRouter)
app.use("/api/todos", todoUtilsRouter)


export default app