const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { getInMemoryStore } = require('../config/db');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Try MongoDB first
    try {
      // Check if user already exists
      const userExists = await User.findOne({ $or: [{ email }, { username }] });

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create user
      const user = await User.create({
        username,
        email,
        password,
      });

      if (user) {
        return res.status(201).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          token: generateToken(user._id),
        });
      }
    } catch (error) {
      console.log('MongoDB not available, using in-memory store');
      // If MongoDB fails, use in-memory store
      const inMemoryStore = getInMemoryStore();
      
      // Check if user already exists
      const userExists = inMemoryStore.users.find(
        user => user.email === email || user.username === username
      );

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const userId = uuidv4();
      const user = {
        _id: userId,
        username,
        email,
        password: hashedPassword,
        createdAt: new Date()
      };

      inMemoryStore.users.push(user);

      return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Try MongoDB first
    try {
      // Check for user email
      const user = await User.findOne({ email });

      if (user && (await user.comparePassword(password))) {
        return res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          token: generateToken(user._id),
        });
      }
    } catch (error) {
      console.log('MongoDB not available, using in-memory store');
      // If MongoDB fails, use in-memory store
      const inMemoryStore = getInMemoryStore();
      
      // Check for user email
      const user = inMemoryStore.users.find(user => user.email === email);

      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          token: generateToken(user._id),
        });
      }
    }

    // If we get here, authentication failed
    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // Try MongoDB first
    try {
      const user = await User.findById(req.user._id).select('-password');

      if (user) {
        return res.json(user);
      }
    } catch (error) {
      console.log('MongoDB not available, using in-memory store');
      // If MongoDB fails, use in-memory store
      const inMemoryStore = getInMemoryStore();
      
      // Find user by ID
      const user = inMemoryStore.users.find(user => user._id === req.user._id);

      if (user) {
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      }
    }

    // If we get here, user not found
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
