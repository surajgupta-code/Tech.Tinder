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
  console.log("Request received:", req.body);
  const { userId, ...updates } = req.body; // ✅ Separate userId from update data
  const allowedUpdates = ['firstName', 'lastName', 'password', 'skills', 'gender'];

  // ✅ Filter out only allowed fields
  const filteredUpdates = Object.keys(updates)
    .filter((key) => allowedUpdates.includes(key))
    .reduce((obj, key) => {
      obj[key] = updates[key];
      return obj;
    }, {});

  // ✅ If no valid updates, reject request
  if (Object.keys(filteredUpdates).length === 0) {
    return res.status(400).send("Invalid updates! No valid fields provided.");
  }

  // ✅ Check if skills is an array and its length is within limits
  if (updates.skills && (!Array.isArray(updates.skills) || updates.skills.length > 10)) {
    return res.status(400).send("Skills should be an array with a maximum of 10 skills.");
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, filteredUpdates, {
      new: true, // ✅ Return updated document
      runValidators: true // ✅ Ensure Mongoose validation runs
    });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).send(error.message);
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
