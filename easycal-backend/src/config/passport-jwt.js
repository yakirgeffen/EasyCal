const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const { getInMemoryStore } = require('./db');

// Options for JWT strategy
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

module.exports = function(passport) {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        // Try MongoDB first
        try {
          const user = await User.findById(jwt_payload.id);
          if (user) {
            return done(null, user);
          }
        } catch (error) {
          console.log('MongoDB not available, using in-memory store');
          // If MongoDB fails, use in-memory store
          const inMemoryStore = getInMemoryStore();
          
          // Find user by ID
          const user = inMemoryStore.users.find(user => user._id === jwt_payload.id);
          
          if (user) {
            return done(null, user);
          }
        }
        
        // If we get here, user not found
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};
