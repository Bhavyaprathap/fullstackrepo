import { api } from "./api";

export const fetchEvents = async () => {
  const { data } = await api.get("/events");
  return data;
};

export const fetchMyEvents = async () => {
  const { data } = await api.get("/events/mine");
  return data;
};

export const createEvent = async (formData) => {
  const { data } = await api.post("/events", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const rsvpJoin = async (eventId) => {
  const { data } = await api.post(`/events/${eventId}/rsvp`);
  return data;
};

export const rsvpLeave = async (eventId) => {
  const { data } = await api.post(`/events/${eventId}/unrsvp`);
  return data;
};
