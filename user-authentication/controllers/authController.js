// controllers/authController.js

const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

// User Registration (Sign Up)
const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
console.log(firstName);

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save the user in the database
    await user.save();

return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error registering user' });
  }
};

// User Login (Sign In)
const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Motdepass incorrect ' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );

    // Return success response with token
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);  // Log error for debugging
    return res.status(500).json({ success: false, message: 'Error logging in' });
  }
};

module.exports = { signUp, signIn };
