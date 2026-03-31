# 💬 Quick Chat App

A simple and modern real-time chat application to connect with other users.
Send text and image messages, track online users, and manage your profile — all in one place.

---

## 🚀 Features

* 👥 User signup/login with JWT authentication
* 🟢 Online/offline user status with Socket.IO
* 💬 Real-time messaging between users
* 🖼️ Image message support
* 🔔 Unseen message count in sidebar
* ✍️ Multiline message input (Shift+Enter)
* 👤 Profile update with Cloudinary image upload
* 📱 Responsive layout for desktop and mobile

---

## 🛠️ How It Works

### ✅ Step 1: Sign Up / Log In

* Create an account or log in with existing credentials.
* JWT token is stored on the client and used for protected API routes.

---

### ✅ Step 2: Select a User and Chat

1. Select a user from the **left sidebar**
2. View chat history
3. Type and send messages (or upload images)
4. Receive messages instantly via Socket.IO

---

### ✅ Step 3: Manage Profile and Presence

The application supports:

* 👤 Profile editing (name, bio, avatar)
* 🟢 Live online users list
* 🔔 Unseen message indicators
* 📂 Media preview in the right panel

---

## 🧮 Message Flow Logic

* Messages are stored in MongoDB.
* New messages are emitted in real time using Socket.IO.
* Unseen counters increase for unopened chats.
* Messages are marked seen when opened.

---

## 🌐 Deployment

> Frontend (Vercel): [VERCEL LINK](https://https://quick-chat-frontend-wheat.vercel.app)

---

## 📦 Installation

```bash
# Clone the repository
git clone <your-repository-url>

# Navigate into project folder
cd chat-app

# Install backend dependencies
cd server
npm install

# Start backend
npm run dev

# In a new terminal, install frontend dependencies
cd ../client
npm install

# Start frontend
npm run dev
```

---


## ⭐ Support

If you found this project helpful:

* ⭐ Star the repository
* 🍴 Fork it
* 🛠️ Contribute to improve it
