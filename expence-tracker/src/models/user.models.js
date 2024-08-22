import { Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

/**
 * here we make userSchema for save user details with all expence details
 * user info : email, name, password, joinDate, address
 * exprence info : title, type, description, date, amount
 */

// Define the expense schema: name, date, amount, type, descriptions
const expenceSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

// Define the address schema: cityName, stateName, pincode
const addressSchema = new Schema({
  cityName: {
    type: String,
    required: true,
  },
  stateName: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
});

// Define the user schema
const userSchema = new Schema({
  emailId: {
    type: String,
    required: true,
    unique: true, 
  },
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: addressSchema, // Embed address schema
  expenceList: [expenceSchema], // Array of expense documents
}, { timestamps: true });

// Pre-save hook: Hash the user's password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});

// Methods for the user schema
// method for varify password
userSchema.methods.isPasswordCorrect = async function (data) {
  return await compare(data, this.password);
};

// method for generate access token
userSchema.methods.generateAccessToken = async function () {
  return await jsonwebtoken.sign(
    {
      "_id": this._id,
      "emailId": this.emailId,
    },
    process.env.ACCESS_TOKEN_SECRET, // Use environment variables for security
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Create the UserModel from the user schema
const UserModel = model("UserModel", userSchema);

export default UserModel;
