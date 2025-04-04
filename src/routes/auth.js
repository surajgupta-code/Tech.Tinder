const express = require("express");
const authRouter = express.Router();
const User = require('../models/user'); // Import User model
const { validateSignupData } = require('../../utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  


authRouter.post('/signup', async (req, res) => {
  
    try {  
      validateSignupData(req); // ✅ Validate user data
      const {firstName, lastName, email, password} = req.body;
      
      const hashedPassword = await bcrypt.hash(password, 10); // ✅ Hash the password
  
      const user = new User({ firstName, lastName, email, password: hashedPassword }); // ✅ Create new
  
  
      await user.save();
      res.status(201).send("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).send("Something went wrong, Error: "  +  error.message);
    }
  });

authRouter .post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password Match Result:", isPasswordValid);

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }
    else {
      const token = await user.getJWT(); // ✅ Generate JWT token
      res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000), httpOnly: true });
      res.status(200).json({ message: "Login successful", token }); // ✅ Send success response with token  
    }
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

  module.exports = authRouter;
