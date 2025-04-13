const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum:{
            values: ['ignored', 'interested','accepted', 'rejected'],
            message: '{VALUE} is not a valid status'
        }
    },   
},{ timestamps: true });
connectionRequestSchema.pre('save', function (next) {
    if (this.fromUserId.toString() === this.toUserId.toString()) {
        return next(new Error("You cannot send a connection request to yourself."));
    }
    next(); // don't forget this!
});

const ConnectionRequest = new mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectionRequest;