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
 * removeExpence
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
    "successMessage" : req.cookies["errorMessage"],
    "userData" : undefined,
    "expenceData" : undefined
  }
  return res.render("userUtils/loginUser.ejs", returnedData)
})

// controller for updateUser page
export const updateUserPage = AsyncHandler(async(req, res) => {
  const returnedData = {
    "title" : "Home Page",
    "errorMessage" : undefined,
    "successMessage" : undefined,
    "userData" : undefined,
    "expenceData" : undefined
  }
  return res.render("home.ejs", returnedData)
})

// controller for changePassword page
export const changeUserPasswordPage = AsyncHandler(async(req, res) => {
  const returnedData = {
    "title" : "Home Page",
    "errorMessage" : undefined,
    "successMessage" : undefined,
    "userData" : undefined,
    "expenceData" : undefined
  }
  return res.render("home.ejs", returnedData)
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

export const userDetails = AsyncHandler(async() => {
  const returnedData = {
    "title" : "Home Page",
    "errorMessage" : undefined,
    "successMessage" : undefined,
    "userData" : undefined,
    "expenceData" : undefined
  }
  return res.render("home.ejs", returnedData)
})

export const addNewExpence = AsyncHandler(async()=> {
  const returnedData = {
    "title" : "Home Page",
    "errorMessage" : undefined,
    "successMessage" : undefined,
    "userData" : undefined,
    "expenceData" : undefined
  }
  return res.render("home.ejs", returnedData)
})

export const updateExpence = AsyncHandler(async()=> {
  const returnedData = {
    "title" : "Home Page",
    "errorMessage" : undefined,
    "successMessage" : undefined,
    "userData" : undefined,
    "expenceData" : undefined
  }
  return res.render("home.ejs", returnedData)
})


export const viewPerticulerExpence = AsyncHandler(async()=> {
  const returnedData = {
    "title" : "Home Page",
    "errorMessage" : undefined,
    "successMessage" : undefined,
    "userData" : undefined,
    "expenceData" : undefined
  }
  return res.render("home.ejs", returnedData)
})