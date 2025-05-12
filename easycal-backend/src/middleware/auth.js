const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getInMemoryStore } = require('../config/db');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try to get user from MongoDB
      try {
        req.user = await User.findById(decoded.id).select('-password');
        if (req.user) {
          return next();
        }
      } catch (error) {
        console.log('MongoDB not available, using in-memory store');
        // If MongoDB fails, use in-memory store
        const inMemoryStore = getInMemoryStore();
        
        // Find user by ID
        const user = inMemoryStore.users.find(user => user._id === decoded.id);
        
        if (user) {
          // Set user without password
          const { password, ...userWithoutPassword } = user;
          req.user = userWithoutPassword;
          return next();
        }
      }

      // If we get here, user not found
      return res.status(401).json({ message: 'Not authorized, user not found' });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
