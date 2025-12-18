const express = require("express");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpJoin,
  rsvpLeave,
  getMyEvents,
} = require("../controllers/eventcontroller");
const auth = require("../middleware/authmiddleware");
const { upload, uploadToCloudinary } = require("../middleware/uploadmiddleware");

const router = express.Router();

// Public: list upcoming events
router.get("/", getEvents);

// Authenticated: my events (created + attending)
router.get("/mine", auth, getMyEvents);

// Public: get single event
router.get("/:id", getEventById);

// Authenticated: create, update, delete
router.post("/", auth, upload.single("image"), uploadToCloudinary, createEvent);

router.put(
  "/:id",
  auth,
  upload.single("image"),
  uploadToCloudinary,
  updateEvent
);

router.delete("/:id", auth, deleteEvent);

// RSVP
router.post("/:id/rsvp", auth, rsvpJoin);
router.post("/:id/unrsvp", auth, rsvpLeave);

module.exports = router;
