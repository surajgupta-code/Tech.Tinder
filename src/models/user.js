const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minLength: 3, maxLength: 20 },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, trim: true, lowercase: true },
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

const User = mongoose.model('User', userSchema);
module.exports = User;
