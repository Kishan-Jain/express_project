import mongoose from "mongoose"

const connectDb = async function(DB_Uri, DB_Name) {
  try {
    const connectDB = await mongoose.connect(`${DB_Uri}/${DB_Name}`)
    console.log(`DataBase Connected successFully \nHost : ${connectDB?.connection.host}`)
  } catch (error) {
    console.log("DataBase connection failed")
  }
}

export default connectDb