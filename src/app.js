//https://github.com/surajgupta-code/Tech.Tinder.git
//TechTinder       password:8qH0pz9CzW5yRUpi
//'mongodb+srv://NamasteNode:TechTinder@tech.syotinb.mongodb.net/database

const express = require('express');
const app = express();
const connectDB = require('./config/database'); // Import database connection
const cookieParser = require('cookie-parser');
const  userAuth  = require('./middleware/auth'); // Import authentication middleware

// Middleware to parse JSON requests

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth'); // Import authentication routes
const profileRouter = require('./routes/profile'); // Import profile routes
const requestRouter = require('./routes/request'); // Import request routes

app.use('/', authRouter); // Use authentication routes
app.use('/', profileRouter); // Use profile routes
app.use('/', requestRouter); // Use request routes

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
