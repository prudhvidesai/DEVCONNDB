//const { type } = require('express/lib/response');
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
      minLength: 5,
      maxLength: 50,
    },

    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter a valid Email...");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error("Enter a valid Gender Type...");
        }
      },
    },
    about: {
      type: String,
      default: "This is about me, iam a developeer....",
    },
    imageUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/7084/7084424.png",
    },
    skills: { type: [String] },
  },
  { timestamps: true }
);

 userSchema.methods.getJwt = async function(){
  const user = this
  const token = await jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_KEY
  );
  return token
 }

 userSchema.methods.validatePassword = async function(reqPassword){
  const user = this
  const isValid = await bcrypt.compare(reqPassword,user.password)
  return isValid
 }

module.exports = mongoose.model('User', userSchema);