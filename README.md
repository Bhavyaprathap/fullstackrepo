# Mini Event Platform – MERN Stack Internship Project

A full-stack **Mini Event Platform** built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.
The application allows users to sign up, log in, create events, view upcoming events, and RSVP while the backend strictly enforces **capacity limits and concurrency safety**.

This project was developed as part of a **MERN Stack Internship technical assessment**, focusing on correctness, security, and real-world backend logic.

---

## 🚀 Live Links

> ⚠️ Replace these with your actual deployed URLs before submission.

* **Frontend (Deployed App):** [https://fullstackrepo-7f5d.vercel.app)
* **Backend (API Base URL):** [https://fullstackrepo-439f.onrender.com/api)
* **GitHub Repository:** [https://github.com/Bhavyaprathap/fullstackrepo)

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* React Router
* Axios
* CSS (custom, responsive SaaS-style UI)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JSON Web Tokens (JWT)
* bcrypt
* Multer

### Database & Storage

* MongoDB Atlas
* Cloudinary (event image storage)

### Authentication

* JWT-based stateless authentication

---

## ✨ Features

### 1. Authentication

* Secure **Sign Up & Login** using email and password
* Passwords hashed using **bcrypt**
* JWT generated on successful authentication
* Protected backend routes using auth middleware
* Frontend route protection for Dashboard, Create Event, and My Events

---

### 2. Event Management

Authenticated users can:

* Create events with:

  * Title
  * Description
  * Date & Time
  * Location
  * Capacity (max attendees)
  * Optional image upload (stored in Cloudinary)
* View all upcoming events on the main dashboard
* Edit or delete **only events they created** (backend ownership check)

---

### 3. RSVP System (Capacity & Concurrency Safe)

* Users can RSVP (join) or leave an event
* **Capacity strictly enforced**
* **No duplicate RSVPs** per user per event
* **Concurrency-safe implementation** using atomic MongoDB updates

---

### 4. My Events Dashboard

* **Events I created**

  * Lists all events created by the logged-in user
* **Events I’m attending**

  * Lists events where the user has RSVP’d
* Ability to leave events directly from this page

---

### 5. UI / UX & Responsiveness

* Clean, modern **SaaS-style interface**
* Sticky top navbar with active state indication
* Centered authentication cards (Login / Signup)
* Event cards with image, metadata, and actions
* Fully responsive layout:

  * Desktop: multi-column grid
  * Tablet: two-column grid
  * Mobile: single-column layout
* Smooth hover, focus, and transition effects

---

## 📁 Project Structure

```
mini-event-platform/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authcontroller.js
│   │   └── eventcontroller.js
│   ├── middleware/
│   │   ├── authmiddleware.js
│   │   └── uploadmiddleware.js
│   ├── models/
│   │   ├── user.js
│   │   └── event.js
│   ├── routes/
│   │   ├── authoroutes.js
│   │   └── eventroutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── errorHandlers.js
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── EventCard.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateEvent.jsx
│   │   │   └── MyEvents.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   └── events.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`) — **Do Not Commit**

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
PORT=5001
```

### Frontend (`frontend/.env`)

```
VITE_API_BASE_URL=https://your-backend-api.com/api
```

> In local development, the frontend uses a Vite proxy (`/api`) and may not require this variable.

---

## ▶️ Running the App Locally

### Backend

```bash
cd backend
npm install
# create backend/.env as shown above
npm run dev
```

Server runs on **[http://localhost:5001](http://localhost:5001)**

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite runs on **[http://localhost:5173](http://localhost:5173)** (or similar)

---

## ⚙️ RSVP Capacity & Concurrency – Technical Explanation

### Objective

Ensure:

* No overbooking
* No duplicate RSVPs
* Correct behavior under simultaneous requests

### Data Model (Simplified)

```js
{
  title: String,
  description: String,
  date: Date,
  location: String,
  capacity: Number,
  attendees: [ObjectId], // user IDs
  createdBy: ObjectId,
  imageUrl: String
}
```

### Atomic RSVP Join

```js
const event = await Event.findOneAndUpdate(
  {
    _id: req.params.id,
    attendees: { $ne: req.userId },
    $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] }
  },
  { $addToSet: { attendees: req.userId } },
  { new: true }
);
```

### Why This Is Concurrency-Safe

* The condition and update run as **one atomic operation**
* Only the first request that satisfies `attendees < capacity` succeeds
* `$addToSet` prevents duplicate entries
* If no update occurs, the API responds:

  > “Event is full or you already joined.”

### RSVP Leave

```js
await Event.findByIdAndUpdate(
  req.params.id,
  { $pull: { attendees: req.userId } },
  { new: true }
);
```

---

## ☁️ Deployment

### Backend (Render / Railway)

* Root directory: `backend`
* Build command: `npm install`
* Start command: `npm start`
* Set environment variables from `.env`

### Frontend (Vercel / Netlify)

* Root directory: `frontend`
* Build command: `npm run build`
* Output directory: `dist`
* Set `VITE_API_BASE_URL` to deployed backend API

---

## ✅ Implemented Requirements Checklist

### Authentication

* [x] Sign Up & Login
* [x] JWT-based stateless sessions

### Events

* [x] Create events (with image upload)
* [x] View upcoming events
* [x] Edit & delete only own events

### RSVP

* [x] Join & leave events
* [x] Capacity enforcement
* [x] Concurrency-safe atomic updates
* [x] Prevent duplicate RSVPs

### UI & Deployment

* [x] Responsive React UI
* [x] Clean, recruiter-friendly design
* [x] Deployed backend & frontend
* [x] MongoDB Atlas integration

---

## 🔮 Possible Enhancements

* Global search and filtering
* Pagination or infinite scroll
* Toast notifications
* Dark mode support
* AI-assisted event description generation

---

## 👤 Author

**Bhavya Reddy**
MERN Stack Developer Intern Candidate
