const express = require("express");
const mongoose = require("mongoose"); // make sure mongoose is imported
const requestRouter = express.Router();
const userAuth = require('../middleware/auth'); // Import authentication middleware
const ConnectionRequest = require("../models/connectionRequest"); // Import the ConnectionRequest model
const users = require("../models/user"); // Import the User model
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id; // Get the authenticated user's ID
        const toUserId = req.params.toUserId; // Get the recipient's ID from the request parameters
        const status = req.params.status; // Set the status to 'interested'    

        const allowedStatus = ['ignored', 'interested']; // Define allowed status values
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status" + status });
        }
        const toUserIdExists = await users.findById(toUserId); // Check if the recipient exists
        if (!toUserIdExists) {
            return res.status(404).json({ message: "Recipient not found" });
        }
        // Check if a connection request already exists between the two users
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        })
        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection request already exists" });
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save(); // Save the connection request to the database
        res.status(201).json({ message: req.user.firstName + " " + status + " " + toUserIdExists.firstName, data });

    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user;
        const { status, requestId } = req.params;
        const allowedStatus = ["accepted", "rejected"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status: " + status });
        }
        console.log("Reviewing request", {
            requestId,
            loggedInUser: loggedInUserId._id,
            status
        });

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: new mongoose.Types.ObjectId(loggedInUserId._id),
            status: "interested",
        });
        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" });
        }

        connectionRequest.status = status;
        await connectionRequest.save();
        res.status(200).json({ message: loggedInUserId.firstName + " " + status + " the request" });
    } catch (err) {
        console.error("Error in reviewing request:", err.message);
        res.status(400).send("Error: " + err.message);
    }
});

module.exports = requestRouter; // Export the router for use in other files