//https://github.com/surajgupta-code/Tech.Tinder.git
//TechTinder       password:8qH0pz9CzW5yRUpi
// mongodb+srv://TechTinder:8qH0pz9CzW5yRUpi@techtinder.pphom.mongodb.net/

const express = require('express');
const app = express();
const connectDB = require('./config/database'); // Import database connection
const User = require('./models/user'); // Import User model

// Middleware to parse JSON requests
app.use(express.json());

app.post('/signup', async (req, res) => {
  
  const user = new User(req.body);
  
  try {  
    await user.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Connect to the database and start the server
connectDB()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });
