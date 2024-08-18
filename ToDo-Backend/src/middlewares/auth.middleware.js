/**
 * first check (ifAlReadyLogin) :- user already login : for register, login
 * second check (isLogin) : user login or not : for make all user ulitilities thats important to user login
 */

import {cookieExpire, cookieOptions} from "../constants.js"
import jwt from "jsonwebtoken"

export const ifAlReadyLogin = async(req, res, next) => {
  // check 1: accessToken cookie received : redirect to profile
  // if accessToken not received -> means : user not login, directlly pass to next controller
  if(req.cookies?.accessToken){
    return res
    .status(409)
    .redirect("/user/profile")
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
  if(!req.cookies?.accessToken){
    return res
    .status(409)
    .redirect("/user/login")
  }

  const accessToken = req.cookies?.accessToken
  
  let decodeToken  
  try {
    decodeToken = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
  } catch (error) {
    return res
    .status(409)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage",
       `ServerError : ${error.message}  || Token decodation error`, 
       cookieExpire)
    .redirect("/user/login")
  }
  if(!decodeToken){
    return res
    .status(409)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "ServerError : Token decodation failed ", cookieExpire)
    .redirect("/user/login")
  }
  req.userId = decodeToken._id
  return next()
}
