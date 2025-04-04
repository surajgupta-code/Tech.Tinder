const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Ensure correct path
const mongoose = require("mongoose");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies; // Extract token from cookies 
    if (!token) {
      throw new Error("Token not found"); // Handle missing token
    }

    const decodedObj = await jwt.verify(token, "TechTinder@9795"); // Verify token
    const { _id } = decodedObj; // Extract user ID from decoded token

    const user = await User.findById(_id); // Find user by ID
    if (!user) {
      throw new Error("User not found"); // Handle user not found
    }

    req.user = user; // Attach user to request object
    next(); // Proceed to next middleware or route handler

  } catch (err) {
    res.status(400).json({ error: "Unauthorized access: " + err.message }); // Handle errors
  }
};

module.exports = userAuth; // Ensure it's correctly exported
