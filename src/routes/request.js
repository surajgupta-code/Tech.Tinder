const express = require("express");
const requestRouter = express.Router();
const  userAuth  = require('../middleware/auth'); // Import authentication middleware

requestRouter.post("/request", userAuth, async (req, res) => {
  try {
    const user = req.user; // Get the authenticated user from the request
    res.send(user.firstName +"send the connection request"); // Send user data as response
} catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});       

module.exports = requestRouter; // Export the router for use in other files