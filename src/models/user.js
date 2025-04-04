const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minLength: 3, maxLength: 20 },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
     },
    password: { type: String, required: true, trim: true, },
    age: { type: Number },
    gender: {
        type: String,
        validate: {
            validator: function (value) {
                return ["male", "female", "other"].includes(value);
            },
            message: "Gender is invalid"
        }
    },
    
    photoURL: { type: String, default: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png' },
    about: {
        type: String,
        default: 'Hello! I am a new user of TechTinder. I am excited to be a part of this application.'
    },
    skills: { type: [String] },

    
},
{
    timestamps: true
});

userSchema.methods.getJWT = async function  () {
    user = this;
    const token =await jwt.sign({_id:user._id}, "TechTinder@9795", {expiresIn: "24h"});
    return token;
}


const User = mongoose.model('User', userSchema);
module.exports = User;
