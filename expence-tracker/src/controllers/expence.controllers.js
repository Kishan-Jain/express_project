/**
 * add new expence
 * update expence
 * remove expence
 * 
 */

import AsyncHandler from "../utils/asyncHandler.js"
import {cookieExpire, cookieOptions} from "../constants.js"
import UserModel from "../models/user.models.js";


// controller for add new expence
export const addNewExpence = AsyncHandler(async(req, res) => {
  /**
   * Check user login
   * Check data received 
   * extract and validate data
   * search user by userId
   * make expence object and push on user expence array
   * check updation success
   * return success message and redirect to userProfile
   */

  // Check if the user is already logged in.
  if (!req.userId) {
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "LoginError : User not logged in", cookieExpire)
      .redirect("/user/login");
  }

  // Ensure data is received in the request body.
  if (!req.body) {
    return res
      .status(404)
      .cookie("errorMessage", "DataError : Data not received", cookieExpire)
      .redirect(`/user/userProfile/addNewExpence`);
  }
  // destract data from body
  const {title, type, description, amount} = req.body

  // ensure all data field required
  if(![title, type, description, amount].some(field => field)){
    return res
      .status(404)
      .cookie("errorMessage", "DataError : All field is required", cookieExpire)
      .redirect(`/user/userProfile/addNewExpence`);
  }

  // ensure all data field not empty
  if([title, type, description, amount].some(field => field?.toString().trim() === "")){
    return res
    .status(404)
    .cookie("errorMessage", "DataError : Not any field is empty", cookieExpire)
    .redirect(`/user/userProfile/addNewExpence`);
  }

  // make new Expence object
  const newExpence = {title, type, description, amount}
  let searchUser;
  try {
    // retreive user by userId excude password 
    searchUser = await UserModel.findById(req.userId).select("-password")
  } catch (error) {
    return res
      .status(500)
      .cookie("errorMessage", `DbError : ${error.message ||" Unable to find User"}`, cookieExpire)
      .redirect(`/user/userProfile/addNewExpence`);
  }
// check user retreive 
  if(!searchUser){
    return res
    .status(500)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "DbError : User not found", cookieExpire)
    .redirect(`/user/login`);
  }
  // push expence object in user expenceList array
  try {
    searchUser =  await UserModel.findByIdAndUpdate(searchUser._id,{
      $push : {
        expenceList : newExpence
      }
    })
  } catch (error) {
    return res
      .status(500)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", `DbError : ${error.message || "Unable to add expence "}`, cookieExpire)
      .redirect(`/user/userProfile/addNewExpence`);
  }
  // check user updated or not
  if(!searchUser){
    return res
    .status(500)
    .cookie("errorMessage", "DbError : Expence not added ", cookieExpire)
    .redirect(`/user/userProfile/addNewExpence`);
  }
  // return successmessage responce and redirect to user profile
  return res
  .status(201)
  .cookie("successMessage", "New Expence added", cookieExpire)
  .redirect(`/user/userProfile`)
})


// controller for update exprence
export const updateExpence = AsyncHandler(async(req, res) => {
  /**
   * check user login
   * check expence id received on params
   * check data from body
   * search user and find preticuler expence by expenceId 
   * update expence and save
   * return successMessages and redirect to userProfile
   */

  // Check if the user is already logged in.
  if (!req.userId) {
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "LoginError : User not logged in", cookieExpire)
      .redirect("/user/login");
  }
  
  // check userId and ExpenceId received in parameter
  if(!req.params?.userId){
    return res
    .status(404)
    .cookie("errorMessage", "DataError : UserId parameter not received", cookieExpire)
    .redirect(`/user/userProfile`);
  }
  if(!req.params?.expenceId){
    return res
    .status(404)
    .cookie("errorMessage", "DataError : ExpenceId parameter not received", cookieExpire)
    .redirect(`/user/userProfile`);
  }
  // varify userId by middleware and userId by parameter is same
  if(req.params?.userId !== req.userId){
    return res
    .status(404)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "AuthError : User unauthorize access", cookieExpire)
    .redirect(`/user/login`);
  }
  // Ensure data is received in the request body.
  if (!req.body) {
    return res
      .status(404)
      .cookie("errorMessage", "DataError : Data not received", cookieExpire)
      .redirect(`/user/userProfile/updateExpence/${req.expenceId}`);
  }

  // destract data from body
  const {title, type, description, amount} = req.body

  // ensure data is received and not empty
  if(![title, type, description, amount].some(field => field)){
    return res
      .status(404)
      .cookie("errorMessage", "DataError : All field is required", cookieExpire)
      .redirect(`/user/userProfile/updateExpence/${req.expenceId}`);
  }
  if([title, type, description, amount].some(field => field?.toString().trim() === "")){
    return res
    .status(404)
    .cookie("errorMessage", "DataError : Not any field Empty", cookieExpire)
    .redirect(`/user/userProfile/updateExpence/${req.expenceId}`);
  }

  let searchUser
  try {
    // search user by userId perameter 
    searchUser = await UserModel.findById(req.params?.userId).select("-password")
  } catch (error) {
    return res
      .status(500)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", `DbError : ${error.message || "unable to find user"}`, cookieExpire)
      .redirect(`/user/login`);
  }
  // check user not found
  if(!searchUser){
    return res
    .status(409)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "DbError : User not found", cookieExpire)
    .redirect(`/user/login`);
  }

  // find expence details by expenceId parameter
  let expenceDetails = searchUser.expenceList.find(expence => expence._id?.toString() === req.params?.expenceId)
  
  const updateExpence = {title, type, description, amount}
  try {
    // set new data on expence details and save user
    Object.assign(expenceDetails, updateExpence)
    await searchUser.save({validateBeforeSave:false})

    // return successmessage and redirect to user profile
    return res
    .status(200)
    .cookie("successMessage", `Expence updated SuccessFully`, cookieExpire)
    .redirect("/user/userProfile")
  } catch (error) {
    // return error message 
    return res
      .status(404)
      .cookie("errorMessage", `DataError : ${error.message || "Unable to update Expence"}`, cookieExpire)
      .redirect(`/user/userProfile/updateExpence/${req.expenceId}`);
  }
})

// controller for remove expence
export const removeExpence = AsyncHandler(async(req, res) => {
  /**
   * check user login
   * check expence id received on params
   * search user and find preticuler expence by expenceId 
   * filter new expence list without given expenceId ans save
   * return success message and redirect to userProfile 
   */
  
  // Check if the user is already logged in.
  if (!req.userId) {
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "LoginError : User not logged in", cookieExpire)
      .redirect("/user/login");
  }
  
  // check userId and expenceId receive by parameter
  if(!req.params?.userId){
    return res
    .status(404)
    .cookie("errorMessage", "DataError : UserId parameter not received", cookieExpire)
    .redirect(`/user/userProfile`);
  }
  if(!req.params?.expenceId){
    return res
    .status(404)
    .cookie("errorMessage", "DataError : ExpenceId parameter not received", cookieExpire)
    .redirect(`/user/userProfile`);
  }

  // varify userId by middleware and userId by parameter is same
  if(req.userId !== req.params?.userId){
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "AuthError : User Unautherize access", cookieExpire)
      .redirect(`/user/login`);
  }
  let searchUser;
  try {
    // find user by userId and excude password
    searchUser = await UserModel.findById(req.params?.userId).select("-password")
  } catch (error) {
    return res
      .status(500)
      .cookie("errorMessage", `DbError : ${error.message || "Unable to find user"}`, cookieExpire)
      .redirect(`/user/userProfile`);
  }
  // check user found
  if(!searchUser){
    return res
    .status(400)
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "DbError : User not found", cookieExpire)
    .redirect(`/user/login`);
  }

  // create new expenceList without given expenceId
  const newExpenceList = searchUser.expenceList.filter(expence => expence._id?.toString() !== req.params?.expenceId)
  
  try {
    // set newExpenceList in user expenceList and save
    searchUser.expenceList = newExpenceList
    await searchUser.save({validateBeforeSave : true})  
    
    // return successmessage and redirect to userProfile
    return res
    .status(200)
    .cookie("successMessage", "Expence remove successfully", cookieExpire)
    .redirect("/user/userProfile")
  } catch (error) {
    // return error messages
    return res
      .status(500)
      .cookie("errorMessage", `DbError : ${error.message || "Expence remove faild"}`, cookieExpire)
      .redirect(`/user/userProfile`);
  }
})