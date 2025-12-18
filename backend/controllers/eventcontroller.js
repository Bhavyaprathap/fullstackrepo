const Event = require("../models/event");

// Create event
exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, date, time, location, capacity } = req.body;

    if (!title || !description || !date || !time || !location || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const dateTime = new Date(`${date}T${time}`);

    const event = await Event.create({
      title,
      description,
      date: dateTime,
      location,
      capacity,
      imageUrl: req.imageUrl || null,
      createdBy: req.userId,
      attendees: [],
    });

    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

// Get all upcoming events
exports.getEvents = async (req, res, next) => {
  try {
    const now = new Date();
    const events = await Event.find({ date: { $gte: now } })
      .populate("createdBy", "name email")
      .sort({ date: 1 });
    res.json(events);
  } catch (err) {
    next(err);
  }
};

// Get single event
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    next(err);
  }
};

// Update event (only creator)
exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to edit" });
    }

    const { title, description, date, time, location, capacity } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (location) event.location = location;
    if (capacity) event.capacity = capacity;
    if (date && time) {
      event.date = new Date(`${date}T${time}`);
    }
    if (req.imageUrl) {
      event.imageUrl = req.imageUrl;
    }

    const updated = await event.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete event (only creator)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
};

// RSVP join with capacity + concurrency safety
exports.rsvpJoin = async (req, res, next) => {
  try {
    const event = await Event.findOneAndUpdate(
      {
        _id: req.params.id,
        attendees: { $ne: req.userId },
        $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] },
      },
      { $addToSet: { attendees: req.userId } },
      { new: true }
    );

    if (!event) {
      return res
        .status(400)
        .json({ message: "Event is full or you already joined" });
    }
    res.json(event);
  } catch (err) {
    next(err);
  }
};

// Cancel RSVP
exports.rsvpLeave = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $pull: { attendees: req.userId } },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    next(err);
  }
};

// Events created by user & attending
exports.getMyEvents = async (req, res, next) => {
  try {
    const created = await Event.find({ createdBy: req.userId }).sort({
      date: 1,
    });
    const attending = await Event.find({ attendees: req.userId }).sort({
      date: 1,
    });
    res.json({ created, attending });
  } catch (err) {
    next(err);
  }
};
