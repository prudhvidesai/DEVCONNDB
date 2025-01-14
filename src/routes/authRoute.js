
const express = require('express')

const User = require('../models/user')

const {validateUserData} = require('../utils/validator')

const bcrypt = require('bcrypt')

const authRouter = express.Router()

authRouter.post("/signup", async (req, res) => {
  try {
    validateUserData(req);
    //console.log(req.body)
    const { userName, password, email, age, gender, about, imageUrl, skills } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    //console.log(hashedPassword);

    const user = new User({
      userName: userName,
      password: hashedPassword,
      email: email,
      age: age,
      gender: gender,
      about: about,
      imageUrl: imageUrl,
      skills: skills
    });
    const newUser = await user.save();
    const token = await newUser.getJwt()
    res.cookie("token",token)
    res.json({message:"Data updated in DB...", data:newUser});
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const data = req.body;
  try {
    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const secretToken = await user.getJwt();
    //console.log(secretToken)
    res.cookie("token", secretToken);
    const isValid = await user.validatePassword(data.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something Went Wrong :" + " " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
 
  try {
    res.cookie('token',null)
    res.send("Logout Successful...")
  } catch (err) {
    res.status(400).send("Something Went Wrong :" + " " + err.message);
  }
});



module.exports = authRouter