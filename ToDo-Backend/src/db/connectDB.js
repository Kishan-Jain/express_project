import {connect} from "mongoose"

const ConnectDataBase = async(Db_URI, Db_Name) => {
try {
    const connectDB = await connect(`${Db_URI}/${Db_Name}`)
    console.log(`DataBase connected successfully \nDbHost : ${connectDB.connection.host}`)
} catch (error) {
  console.log(`DataBase connection error : ${error.message}`)
  return 
}
}

export default ConnectDataBase