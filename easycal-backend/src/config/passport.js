const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple');
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const { getInMemoryStore } = require('./db');

// Configure Passport
module.exports = function() {
  // Serialize user for the session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      // Try MongoDB first
      try {
        const user = await User.findById(id);
        if (user) {
          return done(null, user);
        }
      } catch (error) {
        console.log('MongoDB not available, using in-memory store');
        // If MongoDB fails, use in-memory store
        const inMemoryStore = getInMemoryStore();
        
        // Find user by ID
        const user = inMemoryStore.users.find(user => user._id === id);
        
        if (user) {
          return done(null, user);
        }
      }
      
      // If we get here, user not found
      return done(null, false);
    } catch (error) {
      return done(error, null);
    }
  });

  // Configure Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Try MongoDB first
          try {
            // Check if user already exists
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
              return done(null, user);
            }

            // If not, create a new user
            user = await User.create({
              googleId: profile.id,
              username: profile.displayName.replace(/\s+/g, '') + uuidv4().substring(0, 6),
              email: profile.emails[0].value,
              displayName: profile.displayName,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              profilePhoto: profile.photos[0].value
            });

            return done(null, user);
          } catch (error) {
            console.log('MongoDB not available, using in-memory store');
            // If MongoDB fails, use in-memory store
            const inMemoryStore = getInMemoryStore();
            
            // Check if user already exists
            let user = inMemoryStore.users.find(user => user.googleId === profile.id);

            if (user) {
              return done(null, user);
            }

            // If not, create a new user
            const userId = uuidv4();
            user = {
              _id: userId,
              googleId: profile.id,
              username: profile.displayName.replace(/\s+/g, '') + uuidv4().substring(0, 6),
              email: profile.emails[0].value,
              displayName: profile.displayName,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              profilePhoto: profile.photos[0].value,
              createdAt: new Date()
            };

            inMemoryStore.users.push(user);
            return done(null, user);
          }
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Configure Apple Strategy
  passport.use(
    new AppleStrategy(
      {
        clientID: process.env.APPLE_CLIENT_ID,
        teamID: process.env.APPLE_TEAM_ID,
        keyID: process.env.APPLE_KEY_ID,
        privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION,
        callbackURL: '/api/auth/apple/callback',
        scope: ['name', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Try MongoDB first
          try {
            // Check if user already exists
            let user = await User.findOne({ appleId: profile.id });

            if (user) {
              return done(null, user);
            }

            // If not, create a new user
            const username = profile.name 
              ? (profile.name.firstName + profile.name.lastName).replace(/\s+/g, '') + uuidv4().substring(0, 6)
              : 'user' + uuidv4().substring(0, 10);

            user = await User.create({
              appleId: profile.id,
              username: username,
              email: profile.email,
              displayName: profile.name ? `${profile.name.firstName} ${profile.name.lastName}` : username,
              firstName: profile.name ? profile.name.firstName : '',
              lastName: profile.name ? profile.name.lastName : ''
            });

            return done(null, user);
          } catch (error) {
            console.log('MongoDB not available, using in-memory store');
            // If MongoDB fails, use in-memory store
            const inMemoryStore = getInMemoryStore();
            
            // Check if user already exists
            let user = inMemoryStore.users.find(user => user.appleId === profile.id);

            if (user) {
              return done(null, user);
            }

            // If not, create a new user
            const userId = uuidv4();
            const username = profile.name 
              ? (profile.name.firstName + profile.name.lastName).replace(/\s+/g, '') + uuidv4().substring(0, 6)
              : 'user' + uuidv4().substring(0, 10);

            user = {
              _id: userId,
              appleId: profile.id,
              username: username,
              email: profile.email,
              displayName: profile.name ? `${profile.name.firstName} ${profile.name.lastName}` : username,
              firstName: profile.name ? profile.name.firstName : '',
              lastName: profile.name ? profile.name.lastName : '',
              createdAt: new Date()
            };

            inMemoryStore.users.push(user);
            return done(null, user);
          }
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Configure Microsoft Strategy
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: '/api/auth/microsoft/callback',
        scope: ['user.read', 'user.readbasic.all', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Try MongoDB first
          try {
            // Check if user already exists
            let user = await User.findOne({ microsoftId: profile.id });

            if (user) {
              return done(null, user);
            }

            // If not, create a new user
            user = await User.create({
              microsoftId: profile.id,
              username: profile.displayName.replace(/\s+/g, '') + uuidv4().substring(0, 6),
              email: profile.emails[0].value,
              displayName: profile.displayName,
              firstName: profile.name ? profile.name.givenName : '',
              lastName: profile.name ? profile.name.familyName : '',
              profilePhoto: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : ''
            });

            return done(null, user);
          } catch (error) {
            console.log('MongoDB not available, using in-memory store');
            // If MongoDB fails, use in-memory store
            const inMemoryStore = getInMemoryStore();
            
            // Check if user already exists
            let user = inMemoryStore.users.find(user => user.microsoftId === profile.id);

            if (user) {
              return done(null, user);
            }

            // If not, create a new user
            const userId = uuidv4();
            user = {
              _id: userId,
              microsoftId: profile.id,
              username: profile.displayName.replace(/\s+/g, '') + uuidv4().substring(0, 6),
              email: profile.emails[0].value,
              displayName: profile.displayName,
              firstName: profile.name ? profile.name.givenName : '',
              lastName: profile.name ? profile.name.familyName : '',
              profilePhoto: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
              createdAt: new Date()
            };

            inMemoryStore.users.push(user);
            return done(null, user);
          }
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
};
