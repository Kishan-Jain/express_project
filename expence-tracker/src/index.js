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


await connectDb(DB_Uri, DB_Name).then(
  app.listen(port, async ()=>{
    console.log(`http://localhost:${port}`)
  })
).catch(error =>{
  console.log(`DB-Server connection Error : ${error.message}`)
})
