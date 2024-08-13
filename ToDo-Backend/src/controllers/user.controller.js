import { cookieExpire, cookieOptions } from "../constants.js";
import User from "../models/user.models.js";
import AsyncHandler from "../utils/asyncHandler.js";
import { IsSpaceUsed } from "../utils/customElements.js";

export const registerUser = AsyncHandler(async (req, res) => {
  // Check if the user is already logged in.
  // Validate received data.
  // Ensure that the username and email are not already taken.
  // Create a new user and save their information.
  // Retrieve the newly created user from the database.
  // Redirect with a success message.

  // Check if the user is already logged in.
  if (req.cookie["accessToken"]) {
    return res
      .status(409)
      .cookie("errorMessage", "LoginError : User already logged in", cookieExpire)
      .redirect("/profile");
  }

  // Validate received data.
  if (!req.body) {
    return res
      .status(404)
      .cookie("errorMessage", "DataError : Data not received", cookieExpire)
      .redirect("/register");
  }
  const { userName, emailId, fullName, password, gender } = req.body;

  // Ensure that all fields are provided.
  if (
    [userName, emailId, fullName, password, gender].some(
      (field) => field?.toString().trim() === ""
    )
  ) {
    return res
      .status(404)
      .cookie("errorMessage", "DataError : All fields are required", cookieExpire)
      .redirect("/register");
  }

  // check if fields are invalid
  if ([userName, emailId].some((field) => IsSpaceUsed(field))) {
    return res
      .status(404)
      .cookie("errorMessage", "DataError : Invalid fields", cookieExpire)
      .redirect("/register");
  }

  // Check if the username is already taken.
  if (await User.findOne({ userName })) {
    return res
      .status(409)
      .cookie("errorMessage", "UserError : Username already exists", cookieExpire)
      .redirect("/register");
  }

  // Check if the email is already taken.
  if (await User.findOne({ emailId })) {
    return res
      .status(409)
      .cookie("errorMessage", "UserError : Email already exists", cookieExpire)
      .redirect("/register");
  }

  let newUser;
  try {
    // Create a new user and save their information.
    newUser = new User({ userName, emailId, fullName, password, gender });
    await newUser.save({ validateBeforeSave: true });
  } catch (error) {
    return res
      .status(500)
      .cookie(
        "errorMessage",
        error.message || "DBError : Unable to create user",
        cookieExpire
      )
      .redirect("/register");
  }

  if (!newUser) {
    return res
      .status(500)
      .cookie("errorMessage", "DBError : User not created", cookieExpire)
      .redirect("/register");
  }

  let searchNewUser;
  try {
    // Retrieve the newly created user from the database.
    searchNewUser = await User.findById(newUser._id).select("-password");
  } catch (error) {
    return res
      .status(500)
      .cookie(
        "errorMessage",
        error.message || "DBError : Unable to find user",
        cookieExpire
      )
      .redirect("/register");
  }

  if (!searchNewUser) {
    return res
      .status(500)
      .cookie("errorMessage", "DBError : User not found", cookieExpire)
      .redirect("/register");
  }

  // Redirect with a success message.
  return res
    .status(201)
    .cookie("successMessage", "User created successfully", cookieExpire)
    .render("userUtils/register.ejs", { userData: searchNewUser });
});

export const loginUser = AsyncHandler(async (req, res) => {
  // Verify if the user is already logged in.
  // Validate received data.
  // Check if the user exists.
  // Verify the password.
  // Retrieve the user and update relevant fields.
  // Generate an access token.
  // Set the access token in a cookie and redirect to the user's profile page with a welcome message.

  // Check if the user is already logged in.
  if (req.cookie["accessToken"]) {
    return res
      .status(409)
      .cookie("errorMessage", "LoginError : User already logged in", cookieExpire)
      .redirect("/profile");
  }

  // Validate received data.
  if (!req.body) {
    return res
      .status(404)
      .cookie("errorMessage", "DataError : Data not received", cookieExpire)
      .redirect("/login");
  }

  // Extract data from the request body.
  const { userName, password } = req.body;

  // Ensure that all fields are provided.
  if ([userName, password].some((field) => field?.toString().trim() === "")) {
    return res
      .status(404)
      .cookie("errorMessage", "DataError : All fields are required", cookieExpire)
      .redirect("/register");
  }

  // Check if the username is valid.
  if (IsSpaceUsed(userName)) {
    return res
      .status(404)
      .cookie("errorMessage", "DataError : Invalid field", cookieExpire)
      .redirect("/login");
  }

  // Find the user by username.
  let searchUser;
  try {
    searchUser = await User.findOne({ userName }).select("-password");
  } catch (error) {
    return res
      .status(500)
      .cookie(
        "errorMessage",
        error.message || "DBError : Unable to find user",
        cookieExpire
      )
      .redirect("/login");
  }

  // Check if the user exists.
  if (!searchUser) {
    return res
      .status(404)
      .cookie("errorMessage", "DBError : User does not exist", cookieExpire)
      .redirect("/login");
  }

  // Verify the password.
  if (!(await searchUser.isPasswordCorrect(password))) {
    return res
      .status(500)
      .cookie("errorMessage", "DBError : Incorrect password", cookieExpire)
      .redirect("/login");
  }

  // Generate an access token.
  let accessToken;
  try {
    accessToken = await searchUser.generateAccessToken();
  } catch (error) {
    return res
      .status(500)
      .cookie(
        "errorMessage",
        error.message || "ServerError : Unable to generate access token",
        cookieExpire
      )
      .redirect("/login");
  }

  if (!accessToken) {
    return res
      .status(500)
      .cookie("errorMessage", "ServerError : Access token not generated", cookieExpire)
      .redirect("/login");
  }

  // Update the last login timestamp.
  try {
    searchUser = await User.findByIdAndUpdate(
      searchUser._id,
      { $set: { lastLogin: Date.now() } },
      { new: true }
    ).select("-password");
  } catch (error) {
    return res
      .status(500)
      .cookie(
        "errorMessage",
        error.message || "DBError : Unable to update user",
        cookieExpire
      )
      .redirect("/login");
  }

  if (!searchUser) {
    return res
      .status(500)
      .cookie("errorMessage", "DBError : User not updated", cookieExpire)
      .redirect("/login");
  }

  // Return a success response.
  return res
    .status(200)
    .cookie("successMessage", `welcome, ${searchUser.fullName}`, cookieExpire)
    .cookie("accessToken", accessToken, cookieOptions)
    .render("user/profile.ejs", { userData: searchUser });
});

export const logoutUser = AsyncHandler(async (req, res) => {
  // Verify if the user is logged in.
  // Update relevant data fields.
  // Clear cookies.
  // Redirect to the login page.

  // Check if the user is already logged in.
  if (!req.userId) {
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "LoginError : User not logged in", cookieExpire)
      .redirect("/login");
  }

  // varify logged user and user that logout is same
  if (req.userId !== req.params?.userId) {
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "UserError : Unautherize access", cookieExpire)
      .redirect("/login");
  }

  // Find the user by ID.
  let searchUser;
  try {
    searchUser = await User.findById(req.params?.userId).select("-password");
  } catch (error) {
    return res
      .status(500)
      .cookie(
        "errorMessage",
        error.message || "DBError : Unable to find user",
        cookieExpire
      )
      .redirect("/profile");
  }

  if (!searchUser) {
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "UserError : User not found", cookieExpire)
      .redirect("/login");
  }

  // Update the last logout timestamp.
  try {
    searchUser.lastLogout = Date.now();
    await searchUser.save({ validateBeforeSave: false });
  } catch (error) {
    return res
      .status(500)
      .cookie(
        "errorMessage",
        error.message || "DBError : Unable to update user",
        cookieExpire
      )
      .redirect("/profile");
  }

  // Clear the access token cookie and set a success message.
  return res
    .clearCookie("accessToken", cookieOptions)
    .cookie("successMessage", "User logged out successfully", cookieExpire)
    .redirect("/login");
});

export const updatedUser = AsyncHandler(async (req, res) => {
  // Verify if the user is logged in.
  // Ensure that the userId from the cookie matches the one from the request parameters.
  // Validate received data.
  // Extract relevant data.
  // Update the user's information.
  // Redirect to the user's profile.

  // Check if the user is already logged in.
  if (!req.userId) {
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "LoginError : User not logged in", cookieExpire)
      .redirect("/login");
  }

  // varify logged user and user that update data is same
  if (req.userId !== req.params?.userId) {
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "UserError : Unautherize access", cookieExpire)
      .redirect("/login");
  }

  // Ensure data is received in the request body.
  if (!req.body) {
    return res
      .status(400)
      .cookie("errorMessage", "DataError : Data not received", cookieExpire)
      .redirect("/profile");
  }

  const { emailId, fullName, gender } = req.body;

  // Validate that required fields are not empty.
  if (
    [emailId, fullName, gender].some((field) => field.toString().trim() === "")
  ) {
    return res
      .status(400)
      .cookie("errorMessage", "DataError : All fields required", cookieExpire)
      .redirect("/profile");
  }

  // Find the user by ID.
  let searchUser;
  try {
    searchUser = await User.findById(req.params?.userId).select("-password");
  } catch (error) {
    return res
      .status(500)
      .cookie(
        "errorMessage",
        error.message || "DBError : Unable to find user",
        cookieExpire
      )
      .redirect("/profile");
  }

  // If user not found, return an error.
  if (!searchUser) {
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "UserError : User not found", cookieExpire)
      .redirect("/login");
  }

  // Update user details.
  let updatedUser;
  try {
    updatedUser = await User.findByIdAndUpdate(
      searchUser._id,
      {
        $set: {
          emailId,
          fullName,
          gender,
        },
      },
      { new: true }
    );
  } catch (error) {
    return res
      .status(500)
      .cookie(
        "errorMessage",
        error.message || "DBError : Unable to update user",
        cookieExpire
      )
      .redirect("/profile");
  }

  // If user update fails, return an error.
  if (!updatedUser) {
    return res
      .status(500)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "DBError : User updation failed", cookieExpire)
      .redirect("/login");
  }

  // Generate a new access token for the updated user.
  let accessToken;
  try {
    accessToken = await updatedUser.generateAccessToken();
  } catch (error) {
    return res
      .status(500)
      .cookie(
        "errorMessage",
        error.message || "ServerError : Unable to regenerate Access token",
        cookieExpire
      )
      .redirect("/profile");
  }

  // If token generation fails, return an error.
  if (!accessToken) {
    return res
      .status(500)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "ServerError : Access token regeneration failed", cookieExpire)
      .redirect("/login");
  }

  // Clear existing accessToken cookie and set a new one.
  res.clearCookie("accessToken", cookieOptions);
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("successMessage", "User details updated successfully", cookieExpire)
    .render("userUtils/profile.ejs", { userData: updatedUser });
});

export const deleteUser = AsyncHandler(async (req, res) => {
  // Verify if the user is logged in.
  // Ensure that the userId from the cookie matches the one from the request parameters.
  // Find the user and delete their account.
  // Redirect to the login page.

  // Check if the user is already logged in.
  if (!req.userId) {
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "LoginError : User not logged in", cookieExpire)
      .redirect("/login");
  }

  // varify logged user and user that delete is same
  if (req.userId !== req.params?.userId) {
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "UserError : Unautherize access", cookieExpire)
      .redirect("/login");
  }
  // Find the user by ID.
  let searchUser;
  try {
    searchUser = await User.findById(req.params?.userId).select("-password");
  } catch (error) {
    return res
      .status(500)
      .cookie(
        "errorMessage",
        error.message || "DBError : Unable to find user",
        cookieExpire
      )
      .redirect("/profile");
  }

  // If user not found, return an error.
  if (!searchUser) {
    return res
      .status(400)
      .cookie("errorMessage", "UserError : User not found", cookieExpire)
      .redirect("/profile");
  }

  // Delete the user.
  try {
    await User.findByIdAndDelete(searchUser._id);
  } catch (error) {
    return res
      .status(400)
      .cookie(
        "errorMessage",
        error.message || "DBError : Unable to delete user",
        cookieExpire
      )
      .redirect("/profile");
  }

  // Clear existing accessToken cookie and set a success message.
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .cookie("successMessage", "User deleted successfully", cookieExpire)
    .redirect("/login");
});

export const changePassword = AsyncHandler(async (req, res) => {
  // Verify if the user is logged in.
  // Ensure that the userId from the cookie matches the one from the request parameters.
  // Validate received data.
  // Retrieve the user.
  // Check the old password.
  // Update the password.
  // Log out the user and redirect to the login page.

  // Check if the user is already logged in.
  if (!req.userId) {
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "LoginError : User not logged in", cookieExpire)
      .redirect("/login");
  }

  // Ensure data is received in the request body.
  if (!req.body) {
    return res
      .status(404)
      .cookie("errorMessage", "DataError : Data not received", cookieExpire)
      .redirect("/profile");
  }

  const { newPassword, OldPassword } = req.body;

  // Validate that required fields are not empty.
  if (
    [newPassword, OldPassword].some((field) => field.toString().trim() === "")
  ) {
    return res
      .status(404)
      .cookie("errorMessage", "DataError : Password not received", cookieExpire)
      .redirect("/profile");
  }

  // varify logged user and user that change password is same
  if (req.userId !== req.params?.userId) {
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "UserError : Unautherize access", cookieExpire)
      .redirect("/login");
  }

  // Find the user by ID.
  let searchUser;
  try {
    searchUser = await User.findById(req.params?.userId).select("-password");
  } catch (error) {
    return res
      .status(500)
      .cookie(
        "errorMessage",
        error.message || "DBError : Unable to find user",
        cookieExpire
      )
      .redirect("/profile");
  }

  // If user not found, return an error.
  if (!searchUser) {
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "UserError : User not found", cookieExpire)
      .redirect("/login");
  }

  // Validate the old password.
  if (!(await searchUser.isPasswordCorrect(OldPassword))) {
    return res
      .status(400)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "UserError : Incorrect password", cookieExpire)
      .redirect("/login");
  }

  // Update the user's password.
  try {
    searchUser.password = newPassword;
    await searchUser.save({ validateBeforeSave: false });
  } catch (error) {
    return res
      .status(500)
      .cookie("errorMessage", error.message || "DBError : Unable to change password", cookieExpire)
      .redirect("/profile");
  }

  // Clear existing accessToken cookie and set a success message.
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .cookie("successMessage", "Password changed successfully", cookieExpire)
    .redirect("/login");
});

export const resetPassword = AsyncHandler(async (req, res) => {
  // Check the userId from the request parameters.
  // Retrieve the user.
  // Validate received data.
  // Match the data to the user.
  // Reset the password.
  // If the user is logged in, log them out and redirect to the login page.

  // If userId is not received
  if (!req.params?.userId) {
    return res
      .status(404)
      .cookie("errorMessage", "DataError : UserId not received", cookieExpire)
      .redirect("/resetPassword");
  }

  // If request body is empty
  if (!req.body) {
    return res
      .status(404)
      .cookie("errorMessage", "DataError : Data not received", cookieExpire)
      .redirect("/resetPassword");
  }

  const { userName, emailId, fullName, newPassword } = req.body;

  // If any required field is empty
  if (
    [userName, emailId, fullName, newPassword].some(
      (field) => field.toString().trim() === ""
    )
  ) {
    return res
      .status(400)
      .cookie("errorMessage", "DataError : Data not received", cookieExpire)
      .redirect("/resetPassword");
  }

  let searchUser;
  try {
    // Find the user by userName and exclude the password field
    searchUser = await User.findOne({ userName }).select("-password");
  } catch (error) {
    return res
      .status(500)
      .cookie(
        "errorMessage",
        error.message || "DBError : Unable to find user",
        cookieExpire
      )
      .redirect("/resetPassword");
  }

  if (!(searchUser.emailId === emailId && searchUser.fullName === fullName)) {
    return res
      .status(400)
      .cookie("errorMessage", "UserError : Incorrect User data", cookieExpire)
      .redirect("/resetPassword");
  }

  try {
    // Update the user's password and save
    searchUser.password = newPassword;
    await searchUser.save({ validateBeforeSave: false });
  } catch (error) {
    return res
      .status(500)
      .cookie("errorMessage", "DBError : Unable to reset password", cookieExpire)
      .redirect("/resetPassword");
  }

  return res
    .status(200)
    .cookie("successMessage", "Password changed successfully", cookieExpire)
    .redirect("/login");
});
