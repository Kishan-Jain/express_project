import dotenv from "dotenv"
import app from "./app.js";
import ConnectDataBase from "./db/connectDB.js"


// dotenv configration
dotenv.config({
  path : "../.env"
})

// declare useful variables here
const port = process.env.PORT
const Db_URI = "mongodb+srv://KISHAN:kishan1234@kishanjain.zkdcp1z.mongodb.net"
const Db_Name = (process.env.Db_Name).toString()


try {
  ConnectDataBase(Db_URI, Db_Name)
  .then(
    app.listen(port, () => {
      console.log(`server is listning on http://localhost:${port}`)
    })
  )
  
} catch{(error) => 
  console.log(`DB-SERVER connection failed : ${error.message}`) 
}
