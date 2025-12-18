import React, { useEffect, useState } from "react";
import { fetchMyEvents, rsvpLeave } from "../services/events";
import EventCard from "../components/EventCard";

const MyEvents = () => {
  const [created, setCreated] = useState([]);
  const [attending, setAttending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMyEvents = async () => {
    try {
      setLoading(true);
      const data = await fetchMyEvents();
      setCreated(data.created || []);
      setAttending(data.attending || []);
    } catch (err) {
      setError("Failed to load your events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyEvents();
  }, []);

  const handleLeave = async (id) => {
    try {
      const updated = await rsvpLeave(id);
      setAttending((prev) => prev.map((e) => (e._id === id ? updated : e)));
      setCreated((prev) => prev.map((e) => (e._id === id ? updated : e)));
    } catch (err) {
      alert("Could not leave event.");
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="page">
      <section className="page-header">
        <h1>My events</h1>
        <p className="page-subtitle">
          Events you&apos;re hosting and attending.
        </p>
      </section>

      {loading && <p>Loading...</p>}
      {error && <div className="error-banner">{error}</div>}

      <section className="events-section">
        <h2>Events I created</h2>
        {created.length === 0 ? (
          <p className="empty-text">You haven&apos;t created any events yet.</p>
        ) : (
          <div className="events-grid">
            {created.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isAttending={true}
                isOwner={true}
                onRsvp={() => {}}
                onCancelRsvp={handleLeave}
              />
            ))}
          </div>
        )}
      </section>

      <section className="events-section">
        <h2>Events I&apos;m attending</h2>
        {attending.length === 0 ? (
          <p className="empty-text">
            You&apos;re not attending any events yet.
          </p>
        ) : (
          <div className="events-grid">
            {attending.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isAttending={true}
                isOwner={
                  event.createdBy === user?._id ||
                  event.createdBy?._id === user?._id
                }
                onRsvp={() => {}}
                onCancelRsvp={handleLeave}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyEvents;
