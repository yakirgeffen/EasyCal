const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth with Google
// @route   GET /api/auth/google
// @access  Public
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
// @access  Public
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth.html' }),
  (req, res) => {
    // Generate JWT token
    const token = generateToken(req.user._id);
    
    // Redirect to frontend with token
    res.redirect(`/auth.html?token=${token}&username=${req.user.username}`);
  }
);

// @desc    Auth with Apple
// @route   GET /api/auth/apple
// @access  Public
router.get('/apple', passport.authenticate('apple', { scope: ['name', 'email'] }));

// @desc    Apple auth callback
// @route   GET /api/auth/apple/callback
// @access  Public
router.get(
  '/apple/callback',
  passport.authenticate('apple', { session: false, failureRedirect: '/auth.html' }),
  (req, res) => {
    // Generate JWT token
    const token = generateToken(req.user._id);
    
    // Redirect to frontend with token
    res.redirect(`/auth.html?token=${token}&username=${req.user.username}`);
  }
);

// @desc    Auth with Microsoft
// @route   GET /api/auth/microsoft
// @access  Public
router.get('/microsoft', passport.authenticate('microsoft', { scope: ['user.read', 'user.readbasic.all', 'email'] }));

// @desc    Microsoft auth callback
// @route   GET /api/auth/microsoft/callback
// @access  Public
router.get(
  '/microsoft/callback',
  passport.authenticate('microsoft', { session: false, failureRedirect: '/auth.html' }),
  (req, res) => {
    // Generate JWT token
    const token = generateToken(req.user._id);
    
    // Redirect to frontend with token
    res.redirect(`/auth.html?token=${token}&username=${req.user.username}`);
  }
);

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    displayName: req.user.displayName,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    profilePhoto: req.user.profilePhoto
  });
});

module.exports = router;
