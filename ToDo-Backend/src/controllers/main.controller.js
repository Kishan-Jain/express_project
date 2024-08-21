// This controller for front-end dependence

/**
 * register page
 * login page
 * update user page
 * change password page
 * reset password page
 * find userName page
 * 
 * profile page 
 * userDetails page
 * updateTodo page
 */

import { cookieExpire } from "../constants.js"
import User from "../models/user.models.js"
import AsyncHandler from "../utils/asyncHandler.js"

export const registerUserPage = AsyncHandler(async(req, res) => {
  /**
   * render register page form
   * give data and send to register controller in userUtils
   */
  let errorMessages, successMessages, warningMessages
  if(req.cookies?.errorMessage){
    errorMessages = req.cookies?.errorMessage
  }
  if(req.cookies?.warningMessage){
    warningMessages = req.cookies?.warningMessage
  }
  if(req.cookies?.successMessage){
    successMessages = req.cookies?.successMessage
  }
  const returnedData = {
    "title" : "Register User",
    "errorMessages" : errorMessages,
    "userData" : undefined,
    "successMessages" : successMessages
  }
return res
.status(200)
.render("userUtils/registerUser.ejs", returnedData)  
})
export const loginUserPage = AsyncHandler(async(req, res) => {
  /**
   * render login page form
   * give data and send to login controller in userUtils
   */
  let errorMessages, successMessages, warningMessages
  if(req.cookies?.errorMessage){
    errorMessages = req.cookies?.errorMessage
  }
  if(req.cookies?.warningMessage){
    warningMessages = req.cookies?.warningMessage
  }
  if(req.cookies?.successMessage){
    successMessages = req.cookies?.successMessage
  }
  const returnedData = {
    "title" : "Login User",
    "errorMessages" : errorMessages,
    "userData" : undefined,
    "warningMessages" : warningMessages,
    "successMessages" : successMessages
  }

  return res
  .status(200)
  .render("userUtils/loginUser.ejs", returnedData)  
})
export const updateUserPage = AsyncHandler(async(req, res) => {
  /**
   * render update UserDetails page form
   * give data and send to update controller in userUtils
   */
  if(!req.userId){
    return res
    .status(404)
    .clearCookie("accessToken")
    .cookies("errorMessages", "User authentication failed", cookieExpire)
    .redirect("/user/login")
  }

  const user = await User.findById(req.userId).select("-password")

  let errorMessages, successMessages, warningMessages
  if(req.cookies?.errorMessage){
    errorMessages = req.cookies?.errorMessage
  }
  if(req.cookies?.warningMessage){
    warningMessages = req.cookies?.warningMessage
  }
  if(req.cookies?.successMessage){
    successMessages = req.cookies?.successMessage
  }
  const returnedData = {
    "title" : `Update Profile : ${user?.userName}`,
    "userData" : user,
    "errorMessages" : errorMessages,
    "warningMessages" : warningMessages,
    "successMessages" : successMessages
  }

  return res
  .render("userUtils/updateUser.ejs", returnedData)  
})
export const changePasswordPage = AsyncHandler(async(req, res) => {
  
  if(!req.userId){
    return res
    .status(400)
    
  }

  const user = await User.findById(req.userId).select("-password")
    
  let errorMessages, successMessages, warningMessages
  if(req.cookies?.errorMessage){
    errorMessages = req.cookies?.errorMessage
  }
  if(req.cookies?.warningMessage){
    warningMessages = req.cookies?.warningMessage
  }
  if(req.cookies?.successMessage){
    successMessages = req.cookies?.successMessage
  }
  const returnedData = {
    "title" : `Change password : ${user?.userName}`,
    "userData" : user,
    "errorMessages" : errorMessages,
    "warningMessages" : warningMessages,
    "successMessages" : successMessages
  }

  return res
  .render("userUtils/changeUserPassword.ejs", returnedData)  
})
export const resetPasswordPage = AsyncHandler(async(req, res) => {
  let errorMessages, successMessages, warningMessages
  if(req.cookies?.errorMessage){
    errorMessages = req.cookies?.errorMessage
  }
  if(req.cookies?.warningMessage){
    warningMessages = req.cookies?.warningMessage
  }
  if(req.cookies?.successMessage){
    successMessages = req.cookies?.successMessage
  }
  const returnedData = {
    "title" : `Reset Password page`,
    "errorMessages" : errorMessages,
    "userData" : undefined,
    "warningMessages" : warningMessages,
    "successMessages" : successMessages
  }
  return res
  .render("userUtils/resetUserPassword.ejs", returnedData)  
})
export const findUserNamePage = AsyncHandler(async(req, res) => {
  let errorMessages, successMessages, warningMessages
  if(req.cookies?.errorMessage){
    errorMessages = req.cookies?.errorMessage
  }
  if(req.cookies?.warningMessage){
    warningMessages = req.cookies?.warningMessage
  }
  if(req.cookies?.successMessage){
    successMessages = req.cookies?.successMessage
  }
  const returnedData = {
    "title" : `Find UserName`,
    "errorMessages" : errorMessages,
    "userData" : undefined,
    "warningMessages" : warningMessages,
    "successMessages" : successMessages
  }

  return res
  .render("userUtils/findUserName.ejs", returnedData)  
})
export const userProfilePage = AsyncHandler(async(req, res) => {
  
  /**
   * redirct on profile
   * chack user in request
   * store and return 
   */
  if(!req.userId){
    return res
    .status(404)
    .clearCookie("accessToken")
    .cookies("errorMessages", "User authentication failed", cookieExpire)
    .redirect("/user/login")
  }

  const user = await User.findById(req.userId).select("-password")

  let errorMessages, successMessages, warningMessages
  if(req.cookies?.errorMessage){
    errorMessages = req.cookies?.errorMessage
  }
  if(req.cookies?.warningMessage){
    warningMessages = req.cookies?.warningMessage
  }
  if(req.cookies?.successMessage){
    successMessages = req.cookies?.successMessage
  }
  const returnedData = {
    "title" : `${user?.fullName}`,
    "userData" : user,
    "errorMessages" : errorMessages,
    "warningMessages" : warningMessages,
    "successMessages" : successMessages
  }
  
  return res
  .render("userUtils/userProfile.ejs", returnedData)  
})

export const userDetails = AsyncHandler(async(req, res) => {
  
  /**
   * redirct on profile
   * chack user in request
   * store and return 
   */
  if(!req.userId){
    return res
    .status(404)
    .clearCookie("accessToken")
    .cookies("errorMessages", "User authentication failed", cookieExpire)
    .redirect("/user/login")
  }

  const user = await User.findById(req.userId).select("-password")

  let errorMessages, successMessages, warningMessages
  if(req.cookies?.errorMessage){
    errorMessages = req.cookies?.errorMessage
  }
  if(req.cookies?.warningMessage){
    warningMessages = req.cookies?.warningMessage
  }
  if(req.cookies?.successMessage){
    successMessages = req.cookies?.successMessage
  }
  const returnedData = {
    "title" : `${user?.fullName}`,
    "userData" : user,
    "errorMessages" : errorMessages,
    "warningMessages" : warningMessages,
    "successMessages" : successMessages
  }
  
  return res
  .render("userUtils/userdetails.ejs", returnedData)  
})

export const updateTodo = AsyncHandler( async(req, res) => {
   /**
   * render update todo page form
   * give data and send to update controller in userUtils
   */
   if(!req.userId){
    return res
    .status(404)
    .clearCookie("accessToken")
    .cookies("errorMessages", "User authentication failed", cookieExpire)
    .redirect("/user/login")
  }
  if(req.userId !== req.params.userId){
    return res
    .status(400)
    .clearCookie("accessToken")
    .cookies("errorMessages", "Unathorise Access", cookieExpire)
    .redirect("/user/login")
  }
  if(!req.params?.todoId){
    return res
    .status(404)
    .cookies("errorMessages", "TodoId not Received", cookieExpire)
    .redirect("/user/userProfile")
  }

  const user = await User.findById(req.userId).select("-password")
  const todo = user?.todoList.find(todo => todo._id?.toString() === req.params?.todoId)
  let errorMessages, successMessages, warningMessages
  if(req.cookies?.errorMessage){
    errorMessages = req.cookies?.errorMessage
  }
  if(req.cookies?.warningMessage){
    warningMessages = req.cookies?.warningMessage
  }
  if(req.cookies?.successMessage){
    successMessages = req.cookies?.successMessage
  }
  const returnedData = {
    "title" : `Update Profile : ${user?.userName}`,
    "userData" : user,
    "todo" : todo,
    "errorMessages" : errorMessages,
    "warningMessages" : warningMessages,
    "successMessages" : successMessages
  }

  return res
  .render("userUtils/updateTodo.ejs", returnedData)  
})