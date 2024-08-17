/**
 * todo Schema : todoName, discriptions, addDate, completeDate, complete tick
 * user schema : userName, emailId, fullName, gender, password, todoList
 *
 */

import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define the schema for a to-do item
const todoSchema = new Schema(
  {
    todoName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: function () {
        return this.todoName; // Default description is the same as the todoName
      },
    },
    completeDate: {
      type: Date,
      required: true,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Define the schema for a user
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    lastLogout: {
      type: Date,
      default: null,
    },
    todoList: [todoSchema], // An array of todo items associated with the user
  },
  { timestamps: true }
);

// Middleware: Hash the user's password before saving or updating
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Custom methods for the user schema
// Check if a provided password matches the stored hashed password
userSchema.methods.isPasswordCorrect = async function(value) {
  return await bcrypt.compare(value, this.password);
};

// Generate an access token for the user using their ID and username
userSchema.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
  );
};

// Create the User model
const User = model("User", userSchema);
export default User;
