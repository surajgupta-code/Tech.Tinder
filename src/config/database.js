const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://TechTinder:8qH0pz9CzW5yRUpi@techtinder.pphom.mongodb.net/UserData');
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
