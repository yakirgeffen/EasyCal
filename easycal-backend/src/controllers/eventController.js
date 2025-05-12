const Event = require('../models/Event');
const { v4: uuidv4 } = require('uuid');
const { getInMemoryStore } = require('../config/db');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const {
      title,
      startDate,
      startTime,
      endDate,
      endTime,
      timezone,
      location,
      description,
      organizer,
      organizerEmail,
      allDay,
      recurring,
      rsvp
    } = req.body;

    // Try MongoDB first
    try {
      // Create event
      const event = await Event.create({
        title,
        startDate,
        startTime,
        endDate,
        endTime,
        timezone,
        location,
        description,
        organizer,
        organizerEmail,
        allDay,
        recurring,
        rsvp,
        user: req.user._id
      });

      if (event) {
        return res.status(201).json(event);
      }
    } catch (error) {
      console.log('MongoDB not available, using in-memory store');
      // If MongoDB fails, use in-memory store
      const inMemoryStore = getInMemoryStore();
      
      // Create event
      const eventId = uuidv4();
      const event = {
        _id: eventId,
        title,
        startDate,
        startTime,
        endDate,
        endTime,
        timezone,
        location,
        description,
        organizer,
        organizerEmail,
        allDay: allDay || false,
        recurring: recurring || false,
        rsvp: rsvp || false,
        user: req.user._id,
        createdAt: new Date()
      };

      inMemoryStore.events.push(event);
      return res.status(201).json(event);
    }

    return res.status(400).json({ message: 'Invalid event data' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all events for a user
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
  try {
    // Try MongoDB first
    try {
      const events = await Event.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json(events);
    } catch (error) {
      console.log('MongoDB not available, using in-memory store');
      // If MongoDB fails, use in-memory store
      const inMemoryStore = getInMemoryStore();
      
      // Get events for user
      const events = inMemoryStore.events
        .filter(event => event.user === req.user._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return res.json(events);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single event
// @route   GET /api/events/:id
// @access  Private
const getEvent = async (req, res) => {
  try {
    // Try MongoDB first
    try {
      const event = await Event.findById(req.params.id);

      if (event) {
        // Check if the event belongs to the user
        if (event.user.toString() !== req.user._id.toString()) {
          return res.status(401).json({ message: 'Not authorized to access this event' });
        }

        return res.json(event);
      }
    } catch (error) {
      console.log('MongoDB not available, using in-memory store');
      // If MongoDB fails, use in-memory store
      const inMemoryStore = getInMemoryStore();
      
      // Find event by ID
      const event = inMemoryStore.events.find(event => event._id === req.params.id);

      if (event) {
        // Check if the event belongs to the user
        if (event.user !== req.user._id) {
          return res.status(401).json({ message: 'Not authorized to access this event' });
        }

        return res.json(event);
      }
    }

    // If we get here, event not found
    return res.status(404).json({ message: 'Event not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
  try {
    // Try MongoDB first
    try {
      const event = await Event.findById(req.params.id);

      if (event) {
        // Check if the event belongs to the user
        if (event.user.toString() !== req.user._id.toString()) {
          return res.status(401).json({ message: 'Not authorized to update this event' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true, runValidators: true }
        );

        return res.json(updatedEvent);
      }
    } catch (error) {
      console.log('MongoDB not available, using in-memory store');
      // If MongoDB fails, use in-memory store
      const inMemoryStore = getInMemoryStore();
      
      // Find event by ID
      const eventIndex = inMemoryStore.events.findIndex(event => event._id === req.params.id);

      if (eventIndex !== -1) {
        const event = inMemoryStore.events[eventIndex];
        
        // Check if the event belongs to the user
        if (event.user !== req.user._id) {
          return res.status(401).json({ message: 'Not authorized to update this event' });
        }

        // Update event
        const updatedEvent = {
          ...event,
          ...req.body,
          _id: event._id, // Ensure ID doesn't change
          user: event.user // Ensure user doesn't change
        };

        inMemoryStore.events[eventIndex] = updatedEvent;
        return res.json(updatedEvent);
      }
    }

    // If we get here, event not found
    return res.status(404).json({ message: 'Event not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    // Try MongoDB first
    try {
      const event = await Event.findById(req.params.id);

      if (event) {
        // Check if the event belongs to the user
        if (event.user.toString() !== req.user._id.toString()) {
          return res.status(401).json({ message: 'Not authorized to delete this event' });
        }

        await event.deleteOne();
        return res.json({ message: 'Event removed' });
      }
    } catch (error) {
      console.log('MongoDB not available, using in-memory store');
      // If MongoDB fails, use in-memory store
      const inMemoryStore = getInMemoryStore();
      
      // Find event by ID
      const eventIndex = inMemoryStore.events.findIndex(event => event._id === req.params.id);

      if (eventIndex !== -1) {
        const event = inMemoryStore.events[eventIndex];
        
        // Check if the event belongs to the user
        if (event.user !== req.user._id) {
          return res.status(401).json({ message: 'Not authorized to delete this event' });
        }

        // Remove event
        inMemoryStore.events.splice(eventIndex, 1);
        return res.json({ message: 'Event removed' });
      }
    }

    // If we get here, event not found
    return res.status(404).json({ message: 'Event not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent
};
