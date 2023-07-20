require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { connectToDatabase, User } = require('./db'); // Import the connectToDatabase function and User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Connect to the database
connectToDatabase("mongodb://localhost:27017/Register");

// Middleware
app.use(express.json());
app.use(cors());

// User registration
app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// User login and token generation
app.post('/api/auth/login', async (req, res) => {
  // ... (The rest of the login code)

});

// ... (your other routes and code)

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
