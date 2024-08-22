import dotenv from "dotenv"
import app from "./app.js";
import connectDb from "./db/connectDb.js";

// dotEnv configrations
dotenv.config({
  path : "../.env"
})

// declare variable
const port = process.env.PORT
const DB_Uri = process.env.DB_URI
const DB_Name = process.env.DB_NAME


connectDb(DB_Uri, DB_Name)
.then(
  app.listen(port, ()=>{
    console.log(`http://localhost:${port}`)
  })
)
.catch(
  console.log("DB-Server connection failed")
)
