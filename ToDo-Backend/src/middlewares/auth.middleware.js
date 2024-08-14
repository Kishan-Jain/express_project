/**
 * first check (ifAlReadyLogin) :- user already login : for register, login
 * second check (isLogin) : user login or not : for make all user ulitilities thats important to user login
 */

import {cookieExpire, cookieOptions} from "../constants.js"
import jwt from "jsonwebtoken"

export const ifAlReadyLogin = async(req, res, next) => {
  // check 1: accessToken cookie received : redirect to profile
  // if accessToken not received -> means : user not login, directlly pass to next controller
  if(req.cookie["accessToken"]){
    return res
    .status(409)
    .cookie("warningMessage", "User Already login", cookieExpire)
    .redirect("/profile")
  }
  next()
}

export const isLogin = async(req, res, next) => {
  // check 1 : if accessToken cookie not received : redirect to login
  // if accessToken recevied : 
  /**
   * stap 1 : store accessToken
   * step 2 : decode by jwt
   * step 3 : retern userId in request
   */
  if(!req.cookie["accessToken"]){
    return res
    .status(409)
    .cookie("ErrorMessage", "LoginError : User not login", cookieExpire)
    .redirect("/login")
  }

  const accessToken = req.cookie["accessToken"]
  
  let decodeToken  
  try {
    decodeToken = await jwt.decode(accessToken, {complete : true})
  } catch (error) {
    return res
    .status(409)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "ServerError : Token decodation failed ", cookieExpire)
    .redirect("/login")
  }
  req.userId = decodeToken._id
  return next()
}
