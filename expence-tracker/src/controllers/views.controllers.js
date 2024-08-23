/**
 * homepage
 * registerUserPage
 * login user page
 * update user details page
 * change pssword page
 * reset password page
 * 
 * userProfile
 * userDetails
 * 
 * viewPerticulerExpence
 * addNewExpence
 * updateExpence
 */

import AsyncHandler from "../utils/asyncHandler.js"
import {cookieExpire, cookieOptions} from "../constants.js"
import UserModel from "../models/user.models.js"
// controller for home page views
export const homePage = AsyncHandler(async(req, res) => {
  const returnedData = {
    "title" : "Home Page",
    "errorMessage" : undefined,
    "successMessage" : undefined,
    "userData" : undefined,
    "expenceData" : undefined
  }
  return res.render("home.ejs", returnedData)
})

// controller for register user page
export const registerUserPage = AsyncHandler(async(req, res) => {
  /**
   * check user not login -> accessToken
   * 
   */
  if(req.cookies["accessToken"]){
    return res
    .status(409)
    .cookies("errorMessage", "User already login", cookieExpire)
    .redirect("/user/userProfile")
  }
  const returnedData = {
    "title" : "Register User",
    "errorMessage" : req.cookies["errorMessage"],
    "successMessage" : req.cookies["successMessage"],
    "userData" : undefined,
    "expenceData" : undefined
  }
  return res.render("userUtils/registerUser.ejs", returnedData)
})

// controller for login user page
export const loginUserPage = AsyncHandler(async(req, res) => {
  /**
   * check user already login
   */
  if(req.cookies["accessToken"]){
    return res
    .status(409)
    .cookies("errorMessage", "User already login", cookieExpire)
    .redirect("/user/userProfile")
  }
  const returnedData = {
    "title" : "Login User page",
    "errorMessage" : req.cookies["errorMessage"],
    "successMessage" : req.cookies["successMessage"],
    "userData" : undefined,
    "expenceData" : undefined
  }
  return res.render("userUtils/loginUser.ejs", returnedData)
})

// controller for updateUser page
export const updateUserPage = AsyncHandler(async(req, res) => {
  if(!req.userId){
    return res
    .status(400)
    .clearCookie("accessToken", cookieOptions)
    .cookies("errorMessage", "User not login", cookieExpire)
    .redirect("/user/login")
  }

  let searchUser
  try {
    searchUser = await UserModel.findById(req.userId).select("-password")
  } catch (error) {
      return res
      .status(500)
      .cookies("errorMessage", `DbError : ${error.message || "Unable to find user"}`, cookieExpire)
      .redirect("/user/userProfile")
  }
  if(!searchUser){
    return res
      .status(404)
      .clearCookie("accessToken", cookieOptions)
      .cookies("errorMessage", `DbError : user not found`, cookieExpire)
      .redirect("/user/login")
  }

  const returnedData = {
    "title" : `UpdatedDetails : ${searchUser.fullName}`,
    "errorMessage" : req.cookies["errorMessage"],
    "successMessage" : req.cookies["successMessage"],
    "userData" : searchUser,
    "expenceData" : undefined
  }
  return res.render("userUtils/updateUserDetails.ejs", returnedData)
})

// controller for changePassword page
export const changeUserPasswordPage = AsyncHandler(async(req, res) => {
  if(!req.userId){
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookies("errorMessage", `loginError : User login failed`, cookieExpire)
      .redirect("/user/login")
  }
  if(!req.params?.userId){
    return res
      .status(409)
      .cookies("errorMessage", `DbError :  UserId not received in params`, cookieExpire)
      .redirect("/user/userProfile")
  }
  let searchUser
  try {
    searchUser = await UserModel.findById(req.userId).select("-password")
  } catch (error) {
      return res
      .status(500)
      .cookies("errorMessage", `DbError : ${error.message || "Unable to find user"}`, cookieExpire)
      .redirect("/user/userProfile")
  }
  if(!searchUser){
    return res
      .status(404)
      .clearCookie("accessToken", cookieOptions)
      .cookies("errorMessage", `DbError : user not found`, cookieExpire)
      .redirect("/user/login")
  }

  const returnedData = {
    "title" : `Change Password : ${searchUser.fullName}`,
    "errorMessage" : req.cookies["errorMessage"],
    "successMessage" : req.cookies["successMessage"],
    "userData" : searchUser
  }
  return res.render("userUtils/changeUserPassword.ejs", returnedData)
})

// controller for reset userPassword page
export const resetUserPasswordPage = AsyncHandler(async(req, res) => {
  if(req.cookies["accessToken"]){
    return res
    .status(409)
    .cookies("errorMessage", "User already login", cookieExpire)
    .redirect("/user/userProfile")
  }
  const returnedData = {
    "title" : "Reset User Password",
    "errorMessage" : req.cookies["errorMessage"],
    "successMessage" : req.cookies["successMessage"],
    "userData" : undefined,
    "expenceData" : undefined
  }
  return res.render("userUtils/resetUserPassword.ejs", returnedData)
})

export const userProfile = AsyncHandler(async(req, res)=> {
  if(!req.userId){
    return res
    .status(400)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "User login failed", cookieExpire)
    .redirect("/user/loginUser")
  }
  let searchUser
  try {
    searchUser = await UserModel.findById(req.userId).select("-password")
  } catch (error) {
    return res
    .status(500)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", `DbError : ${error.message ||"Unable to find user"}`, cookieExpire)
    .redirect("/user/loginUser")
  }
  if(!searchUser){
    return res
    .status(400)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "User not found", cookieExpire)
    .redirect("/user/loginUser")
  }
  const returnedData = {
    "title" : `Profile login : ${searchUser?.fullName}`,
    "errorMessage" : req.cookies["errorMessage"],
    "successMessage" : req.cookies["successMessage"],
    "userData" : searchUser,
    "expenceData" : searchUser?.expenceList
  }
  return res.render("userUtils/userProfile.ejs", returnedData)
})

export const userDetails = AsyncHandler(async(req, res) => {
  if(!req.userId){
    return res
    .status(400)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "User login failed", cookieExpire)
    .redirect("/user/loginUser")
  }
  let searchUser
  try {
    searchUser = await UserModel.findById(req.userId).select("-password")
  } catch (error) {
    return res
    .status(500)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", `DbError : ${error.message ||"Unable to find user"}`, cookieExpire)
    .redirect("/user/loginUser")
  }
  if(!searchUser){
    return res
    .status(400)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "User not found", cookieExpire)
    .redirect("/user/loginUser")
  }
  const returnedData = {
    "title" : `userDetails : ${searchUser.fullName}`,
    "errorMessage" : req.cookies["errorMessage"],
    "successMessage" : req.cookies["successMessage"],
    "userData" : searchUser
  }
  return res.render("userUtils/userDetails.ejs", returnedData)
})

export const addNewExpence = AsyncHandler(async(req, res)=> {
  if(!req.userId){
    return res
    .status(400)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "User login failed", cookieExpire)
    .redirect("/user/loginUser")
  }
  let searchUser
  try {
    searchUser = await UserModel.findById(req.userId).select("-password")
  } catch (error) {
    return res
    .status(500)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", `DbError : ${error.message ||"Unable to find user"}`, cookieExpire)
    .redirect("/user/loginUser")
  }
  if(!searchUser){
    return res
    .status(400)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "User not found", cookieExpire)
    .redirect("/user/loginUser")
  }

  const returnedData = {
    "title" : `${searchUser.fullName} : Add new Expence`,
    "errorMessage" : req.cookies["errorMessage"],
    "successMessage" : req.cookies["successMessage"],
    "userData" : searchUser,
    "expenceData" : undefined
  }
  return res.render("expenceUtils/addNewExpence.ejs", returnedData)
})

export const updateExpence = AsyncHandler(async(req, res)=> {
  if(!req.userId){
    return res
    .status(400)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "User login failed", cookieExpire)
    .redirect("/user/loginUser")
  }
  if(!req.params?.expenceId){
    return res
    .status(400)
    .cookie("errorMessage", "expenceId not received", cookieExpire)
    .redirect("/user/UserProfile")
  }
  let searchUser
  try {
    searchUser = await UserModel.findById(req.userId).select("-password")
  } catch (error) {
    return res
    .status(500)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", `DbError : ${error.message ||"Unable to find user"}`, cookieExpire)
    .redirect("/user/loginUser")
  }
  if(!searchUser){
    return res
    .status(400)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "User not found", cookieExpire)
    .redirect("/user/loginUser")
  }
  const expenceData = searchUser.expenceList.find(expence => expence._id?.toString() === req.params?.expenceId)
  
  const returnedData = {
    "title" : `Update Expence : ${expenceData?.type}`,
    "errorMessage" : req.cookies["errorMessage"],
    "successMessage" : req.cookies["successMessage"],
    "userData" : searchUser,
    "expenceData" : expenceData
  }
  return res.render("expenceUtils/updateExpence.ejs", returnedData)
})


export const viewPerticulerExpence = AsyncHandler(async(req, res)=> {
  if(!req.userId){
    return res
    .status(400)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "User login failed", cookieExpire)
    .redirect("/user/loginUser")
  }
  if(!req.params?.expenceId){
    return res
    .status(400)
    .cookie("errorMessage", "expenceId not received", cookieExpire)
    .redirect("/user/UserProfile")
  }
  let searchUser
  try {
    searchUser = await UserModel.findById(req.userId).select("-password")
  } catch (error) {
    return res
    .status(500)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", `DbError : ${error.message ||"Unable to find user"}`, cookieExpire)
    .redirect("/user/loginUser")
  }
  if(!searchUser){
    return res
    .status(400)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "User not found", cookieExpire)
    .redirect("/user/loginUser")
  }
  
  const expenceData = searchUser.expenceList.find(expence => expence._id?.toString() === req.params?.expenceId)
  
  const returnedData = {
    "title" : `Expence : ${expenceData.title}`,
    "errorMessage" : req.cookies["errorMessage"],
    "successMessage" : req.cookies["successMessage"],
    "userData" : searchUser,
    "expenceData" : expenceData
  }
  return res.render("expenceUtils/viewSingleExpence.ejs", returnedData)
})