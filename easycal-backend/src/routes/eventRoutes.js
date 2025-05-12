const express = require('express');
const router = express.Router();
const { 
  createEvent, 
  getEvents, 
  getEvent, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Get all events and create a new event
router.route('/')
  .get(getEvents)
  .post(createEvent);

// Get, update, and delete a specific event
router.route('/:id')
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);

module.exports = router;
