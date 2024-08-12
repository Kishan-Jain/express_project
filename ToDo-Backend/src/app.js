import express from "express"
import cookie from "cookie-parser"

const app = express()

app.use(express.json({limit:"8kb"}))
app.use(express.urlencoded({extended:true, limit:"8kb"}))
app.use(express.static("public"))
app.use(cookie())

app.set("view engine", "ejs")
app.set("views", "./views")


export default app