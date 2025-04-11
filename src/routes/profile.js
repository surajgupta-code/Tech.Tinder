const express = require("express");
const   profileRouter = express.Router();
const  userAuth  = require('../middleware/auth'); // Import authentication middleware
const { validate } = require("../models/user");
const {validateEditProfileData} = require('../../utils/validation'); // Import validation function
const User = require("../models/user"); // ✅ Missing import added
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user; // Get the authenticated user from the request
    res.status(200).json({ user }); // Send user data as response
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        if(!validateEditProfileData(req.body)){
        throw new Error("Invalid data");     
        }
        const loggedInUser= req.user;
        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
        await loggedInUser.save();
        res.status(200).json({ message:  `${loggedInUser.firstName} Your Profile updated successfully` });
      }catch(err){
      res.status(400).send("Error: "+ err.message);
    }
})

profileRouter.patch("/profile/forget-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword || newPassword.length < 6)
      return res.status(400).json({ error: "Invalid input." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: `${user.firstName}, password updated successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = profileRouter; // Export the router for use in other files