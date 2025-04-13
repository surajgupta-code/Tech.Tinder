const express = require("express");
const userAuth = require("../middleware/auth");
const User = require("../models/user");
const mongoose = require("mongoose");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills" 
// Get all the pending requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId",["firstName", "lastName"]);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred",
            error: error.message
        });
    }
});
userRouter.get("/user/connections", userAuth, async(req,res)=>{
    try{
        const loggedInUser =req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },

            ],
        }).populate( "fromUserId", USER_SAFE_DATA)
          .populate("toUserId", USER_SAFE_DATA);

          const data = connectionRequests.map((row) => {
            const fromId = row.fromUserId._id ? row.fromUserId._id.toString() : row.fromUserId.toString();
            const loggedInId = loggedInUser._id.toString();
        
            return (fromId === loggedInId) ? row.toUserId : row.fromUserId;
        });
        res.json({
            message: "Data fetched successfully",
            data: data
        });        
    }
    catch(err){
        req.statusCode(400).send("ERROR: "+ err.message );

    }
});


userRouter.get("/feed", userAuth, async(req, res)=>{
try{

    const page = req.query.page || 1; 
    const limit = req.query.limit || 10; // Get the limit from the query parameters (default to 10)
    const skip = (page - 1) * limit; 

    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
        $or:[
            { toUserId: loggedInUser._id},
            { fromUserId: loggedInUser._id}
        ]}).select("fromUserId toUserId ").populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId._id.toString());
            hideUsersFromFeed.add(req.toUserId._id.toString());
        });
        console.log("Hide Users From Feed", hideUsersFromFeed);
        
        const users = await User.find({
            $and:[
                { _id: { $ne: loggedInUser._id } },
                { _id: { $nin: Array.from(hideUsersFromFeed) } }
            ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.json({
            message: "Feed fetched successfully",
            data: Array.from(users)
        });

}catch(err){
    res.status(400).json({
        message: "Error fetching feed",
        error: err.message
    });
}
});


module.exports = userRouter;
