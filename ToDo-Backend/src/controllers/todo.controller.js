/**
 * add new todo
 * update todo
 * chack mark complete
 * delete topo
 */
import AsyncHandler from "../utils/asyncHandler.js"
import {cookieExpire, cookieOptions} from "../constants.js"
import User from "../models/user.models.js"

export const addNewTodo = AsyncHandler(async(req, res) => {
  /**
   * check user login -> receive userId
   * chack data received and validate
   * create new object
   * insert in user todoList field
   * redirect to profile
   */

  if(!req.userId){
    return res
    .clearCookie("accessToken", cookieOptions)
    .cookie("errorMessage", "LoginError : User not login", cookieExpire)
    .redirect("/login")
  }
  if(!req.body){

  }
  
  const {todoName, discription, completeDate} = req.body

  if([todoName, discription, completeDate].some(field => field?.toString().trim() === "")){

  }
  const newTodoObject = {todoName, discription, completeDate}

  try {
    await User.findByIdAndUpdate(req.userId,
      {
        $push : {
          todoList: newTodoObject
        }
      }
    )
  } catch (error) {
    
  }
  return res
  .status(200)
  .cookie("successMessage", "Todo added successfull", cookieExpire)
  .redirect("/profile")
})

export const updateTodo = AsyncHandler(async (req, res) => {
  /**
   * check user login -> receive userId
   * find todo by given todoId in params
   * chack data received and validate
   * update todo
   * redirect to profile
   */

  // User Authentication
  if (!req.userId) {
    return res
      .status(409)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "LoginError: User not logged in", cookieExpire)
      .redirect("/login");
  }

  // Todo ID Validation
  if (!req.params?.todoId) {
    return res
      .status(404)
      .cookie("errorMessage", "DataError: TodoId not received", cookieExpire)
      .redirect("/profile");
  }

  // Data Validation
  const { todoName, description, completeDate } = req.body;
  if ([todoName, description, completeDate].some((field) => !field?.trim())) {
    return res
      .status(400)
      .cookie("errorMessage", "DataError: All fields are required", cookieExpire)
      .redirect("/addTodo");
  }

  // User and Todo Lookup
  let searchUser;
  try {
    searchUser = await User.findById(req.userId).select("-password");
  } catch (error) {
    return res
      .status(500)
      .cookie("errorMessage", error.message || "DBError: Unable to find User", cookieExpire)
      .redirect("/profile");
  }
  if (!searchUser) {
    return res
      .status(409)
      .clearCookie("accessToken", cookieOptions)
      .cookie("errorMessage", "UserError: User not found", cookieExpire)
      .redirect("/login");
  }

  let myTodo;
  try {
    myTodo = searchUser.todoList.find((todo) => todo._id === req.params?.todoId);
  } catch (error) {
    return res
      .status(500)
      .cookie("errorMessage", error.message || "DataError: Unable to find todo", cookieExpire)
      .redirect("/profile");
  }
  if (!myTodo) {
    return res
      .status(400)
      .cookie("errorMessage", "UserError: Todo not found", cookieExpire)
      .redirect("/profile");
  }

  // Todo Update
  try {
    const updateMyTodo = { todoName, description, completeDate };
    Object.assign(myTodo, updateMyTodo); // Update fields
    await searchUser.save({ validateBeforeSave: false });
  } catch (error) {
    return res
      .status(500)
      .cookie("errorMessage", error.message || "DBError: Unable to update Todo", cookieExpire)
      .redirect("/profile");
  }

  // Success Response
  return res
    .status(200)
    .cookie("successMessage", "Todo updated successfully", cookieExpire)
    .redirect("/profile");
});



export const markToComplete = AsyncHandler(async(req, res) => {
  /**
   * check user login -> receive userId
   * find todo by given todoId in params
   * change todo status
   * redirect to profile
   */

    // User Authentication
    if (!req.userId) {
      return res
        .status(409)
        .clearCookie("accessToken", cookieOptions)
        .cookie("errorMessage", "LoginError: User not logged in", cookieExpire)
        .redirect("/login");
    }
  
    // Todo ID Validation
    if (!req.params?.todoId) {
      return res
        .status(404)
        .cookie("errorMessage", "DataError: TodoId not received", cookieExpire)
        .redirect("/profile");
    }
  
    // User and Todo Lookup
    let searchUser;
    try {
      searchUser = await User.findById(req.userId).select("-password");
    } catch (error) {
      return res
        .status(500)
        .cookie("errorMessage", error.message || "DBError: Unable to find User", cookieExpire)
        .redirect("/profile");
    }
    if (!searchUser) {
      return res
        .status(409)
        .clearCookie("accessToken", cookieOptions)
        .cookie("errorMessage", "UserError: User not found", cookieExpire)
        .redirect("/login");
    }
  
    let myTodo;
    try {
      myTodo = searchUser.todoList.find((todo) => todo._id === req.params?.todoId);
    } catch (error) {
      return res
        .status(500)
        .cookie("errorMessage", error.message || "DataError: Unable to find todo", cookieExpire)
        .redirect("/profile");
    }
    if (!myTodo) {
      return res
        .status(400)
        .cookie("errorMessage", "UserError: Todo not found", cookieExpire)
        .redirect("/profile");
    }
  
    // Todo Update
    try {
      const updateMyTodo = { isComplete : true };
      Object.assign(myTodo, updateMyTodo); // Update fields
      await searchUser.save({ validateBeforeSave: false });
    } catch (error) {
      return res
        .status(500)
        .cookie("errorMessage", error.message || "DBError: Unable to update Todo", cookieExpire)
        .redirect("/profile");
    }
  
    // Success Response
    return res
      .status(200)
      .cookie("successMessage", "Todo Completed marked", cookieExpire)
      .redirect("/profile");
  
})

export const removeTodo = AsyncHandler(async(req, res) => {
  /**
   * check user login -> receive userId
   * find todo by given todoId in params
   * delete todo
   * redirect to profile
   */
    // User Authentication
    if (!req.userId) {
      return res
        .status(409)
        .clearCookie("accessToken", cookieOptions)
        .cookie("errorMessage", "LoginError: User not logged in", cookieExpire)
        .redirect("/login");
    }
  
    // Todo ID Validation
    if (!req.params?.todoId) {
      return res
        .status(404)
        .cookie("errorMessage", "DataError: TodoId not received", cookieExpire)
        .redirect("/profile");
    }

    // User and Todo Lookup
    let searchUser;
    try {
      searchUser = await User.findById(req.userId).select("-password");
    } catch (error) {
      return res
        .status(500)
        .cookie("errorMessage", error.message || "DBError: Unable to find User", cookieExpire)
        .redirect("/profile");
    }
    if (!searchUser) {
      return res
        .status(409)
        .clearCookie("accessToken", cookieOptions)
        .cookie("errorMessage", "UserError: User not found", cookieExpire)
        .redirect("/login");
    }
  
    let newTodoList;
    try {
      newTodoList = searchUser.todoList.filter((todo) => todo._id !== req.params?.todoId);
    } catch (error) {
      return res
        .status(500)
        .cookie("errorMessage", error.message || "DataError: Unable to find todos", cookieExpire)
        .redirect("/profile");
    }
    if (!newTodoList) {
      return res
        .status(400)
        .cookie("errorMessage", "UserError: no any Todo found", cookieExpire)
        .redirect("/profile");
    }
  
    // return todoList without given Todo
    try {
      searchUser.todoList = newTodoList
      await searchUser.save({ validateBeforeSave: false });
    } catch (error) {
      return res
        .status(500)
        .cookie("errorMessage", error.message || "DBError: Unable to remove Todo", cookieExpire)
        .redirect("/profile");
    }
  
    // Success Response
    return res
      .status(200)
      .cookie("successMessage", "Todo remove successfully", cookieExpire)
      .redirect("/profile");
  
})
