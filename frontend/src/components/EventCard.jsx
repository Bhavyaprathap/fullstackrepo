import React from "react";

const EventCard = ({ event, onRsvp, onCancelRsvp, isAttending, isOwner }) => {
  const date = new Date(event.date);
  const attendeeCount = event.attendees ? event.attendees.length : 0;
  const spotsLeft = event.capacity - attendeeCount;

  return (
    <article className="event-card">
      {event.imageUrl && (
        <div className="event-image">
          <img src={event.imageUrl} alt={event.title} />
        </div>
      )}
      <div className="event-content">
        <div className="event-header">
          <h3>{event.title}</h3>
          <span className="event-chip">
            {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
          </span>
        </div>
        <p className="event-description">{event.description}</p>
        <div className="event-meta">
          <span>{date.toLocaleDateString()} </span>
          <span>
            ·{" "}
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span> · {event.location}</span>
        </div>
        <div className="event-actions">
          {isAttending ? (
            <button
              className="btn-outline"
              onClick={() => onCancelRsvp(event._id)}
            >
              Leave event
            </button>
          ) : (
            <button
              className="btn-primary"
              disabled={spotsLeft <= 0}
              onClick={() => onRsvp(event._id)}
            >
              {spotsLeft > 0 ? "Join event" : "Full"}
            </button>
          )}
          {isOwner && <span className="owner-tag">You created this</span>}
        </div>
      </div>
    </article>
  );
};

export default EventCard;
