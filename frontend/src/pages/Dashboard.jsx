import React, { useEffect, useState } from "react";
import { fetchEvents, rsvpJoin, rsvpLeave } from "../services/events";
import EventCard from "../components/EventCard";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleRsvp = async (id) => {
    try {
      const updated = await rsvpJoin(id);
      setEvents((prev) => prev.map((e) => (e._id === id ? updated : e)));
    } catch (err) {
      alert(
        err.response?.data?.message || "Could not join. Event may be full."
      );
    }
  };

  const handleLeave = async (id) => {
    try {
      const updated = await rsvpLeave(id);
      setEvents((prev) => prev.map((e) => (e._id === id ? updated : e)));
    } catch (err) {
      alert(err.response?.data?.message || "Could not leave event.");
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="page">
      <section className="page-header">
        <h1>Upcoming events</h1>
        <p className="page-subtitle">
          Discover and RSVP to events created by the community.
        </p>
      </section>

      {loading && <p>Loading events...</p>}
      {error && <div className="error-banner">{error}</div>}

      {!loading && events.length === 0 && (
        <p className="empty-text">No upcoming events yet. Be the first to create one!</p>
      )}

      <div className="events-grid">
        {events.map((event) => {
          const isAttending = event.attendees?.some(
            (a) => a === user?._id || a?._id === user?._id
          );
          const isOwner =
            event.createdBy === user?._id || event.createdBy?._id === user?._id;
          return (
            <EventCard
              key={event._id}
              event={event}
              isAttending={!!isAttending}
              isOwner={!!isOwner}
              onRsvp={handleRsvp}
              onCancelRsvp={handleLeave}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
