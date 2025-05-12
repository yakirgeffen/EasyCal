const mongoose = require('mongoose');
require('dotenv').config();

// In-memory data store for demo purposes when MongoDB is not available
const inMemoryStore = {
  users: [],
  events: []
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Instead of exiting, we'll throw the error and handle it in server.js
    throw error;
  }
};

// Get the in-memory store for demo purposes
const getInMemoryStore = () => {
  return inMemoryStore;
};

module.exports = connectDB;
module.exports.getInMemoryStore = getInMemoryStore;
