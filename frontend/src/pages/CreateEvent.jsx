import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../services/events";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (image) {
        formData.append("image", image);
      }
      await createEvent(formData);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create event. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section className="page-header">
        <h1>Create an event</h1>
        <p className="page-subtitle">
          Share your meetup, workshop, or gathering with others.
        </p>
      </section>

      <div className="form-card">
        {error && <div className="error-banner">{error}</div>}
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Title
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Date
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Time
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Location
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Capacity
              <input
                type="number"
                name="capacity"
                min="1"
                value={form.capacity}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <label>
            Description
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Image (optional)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
