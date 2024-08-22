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

// controller for home page views
export const homePage = AsyncHandler(async(req, res) => {
  return res.render("home.ejs")
})

// controller for register user page
export const registerUserPage = AsyncHandler(async(req, res) => {
  
})

// controller for login user page
export const loginUserPage = AsyncHandler(async(req, res) => {
  
})

// controller for updateUser page
export const updateUserPage = AsyncHandler(async(req, res) => {
  
})

// controller for changePassword page
export const changeUserPasswordPage = AsyncHandler(async(req, res) => {
  
})

// controller for reset userPassword page
export const resetUserPasswordPage = AsyncHandler(async(req, res) => {
  
})

export const userProfile = AsyncHandler(async()=> {

})

export const userDetails = AsyncHandler(async() => {

})

export const addNewExpence = AsyncHandler(async()=> {
  
})

export const updateExpence = AsyncHandler(async()=> {
  
})


export const viewPerticulerExpence = AsyncHandler(async()=> {
  
})