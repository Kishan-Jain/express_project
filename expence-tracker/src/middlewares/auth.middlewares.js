import jwt from "jsonwebtoken"
import {cookieExpire, cookieOptions} from "../constants.js"

export const ifAlReadyLogin = async function (req, res, next){
  if(req.cookies["accessToken"]){
    return res
    .status(400)
    .redirect("/user/userProfile")
  }
  next()
}
export const isLogin = async function (req, res, next) {
  if(!req.cookies["accessToken"]){
    return res
    .status(409)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "loginError : User authentication failed", cookieExpire)
    .redirect("/user/login")
  }
  let decodeAccessToken;
  try {
    decodeAccessToken = jwt.verify(req.cookies["accessToken"], process.env.ACCESS_TOKEN_SECRET)
  } catch (error) {
    return res
    .status(500)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", `JWTError : ${ error.message || "AccessToken decoderation failed"}`, cookieExpire)
    .redirect("/user/login")
  }
  if(!decodeAccessToken){
    return res
    .status(500)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", `JWTError : AccessToken not varify`, cookieExpire)
    .redirect("/user/login")
  }
  req.userId = decodeAccessToken._id
  next()
}