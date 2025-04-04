const express = require("express");
const   profileRouter = express.Router();
const  userAuth  = require('../middleware/auth'); // Import authentication middleware


profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user; // Get the authenticated user from the request
    res.status(200).json({ user }); // Send user data as response
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = profileRouter; // Export the router for use in other files