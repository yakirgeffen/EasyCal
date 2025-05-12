const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  location: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  organizer: {
    type: String,
    trim: true
  },
  organizerEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  allDay: {
    type: Boolean,
    default: false
  },
  recurring: {
    type: Boolean,
    default: false
  },
  rsvp: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
