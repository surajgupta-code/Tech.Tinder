//https://github.com/surajgupta-code/Tech.Tinder.git
//TechTinder       password:8qH0pz9CzW5yRUpi
// mongodb+srv://TechTinder:namasteNode@techtinder.r3e9c.mongodb.net/UserDATA

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

// Get the user by emailid
app.get('/user', async (req, res) =>{
  const userEmail = req.body.email;
  try {
      const users = await User.find({email: userEmail});
      if(users.length > 0){
        res.status(200).send(users);
      } else {
        res.status(404).send("User not found");
      }
  } 
  catch (error) {
    res.status(400).send("  Error");
  }
});

// Feed Api
app.get('/feed', async (req, res) =>{
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send("Error");
  }
});

app.delete('/delete', async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if(user){
      res.status(200).send("User deleted successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(400).send("Error");
  }
}
)

app.patch('/update', async (req, res) => {
  console.log("Request received:", req.body);  // ✅ Debugging: Log incoming request data

  const userId = req.body.userId;  // ✅ Extracting userId from request body
  const updateData = req.body;  // ✅ Extracting update data
  
  try {
    await User.findByIdAndUpdate(userId, updateData, { new: true });  // ✅ Fixed syntax: Directly using userId

    res.status(200).send("User updated successfully");  // ✅ Send success response
  } catch (error) {
    console.error("Error updating user:", error);  // ✅ Debugging: Log error details
    res.status(400).send(error.message);  // ✅ Send actual error message instead of a generic one
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
