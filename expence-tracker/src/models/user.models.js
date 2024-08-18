import { Schema, model } from "mongoose";

/**
 * expence schema : name, date, amount, type, descriptions
 * user schema : email, fullname, address(cityName, state, pincode), password, expencesArray,
  
 */

const expenceSchema = new Schema({

}, {timestamps:true})

const userSchema = new Schema({

  

},{timestamps:true})

const UserModel = model("UserModel", userSchema)

export default UserModel