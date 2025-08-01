### 📄 `README.md`

```markdown
# 🎬 Movie Web App - Fullstack Project

A complete fullstack Movie Web Application with modern technologies, enabling users to browse, search, and book movie tickets with real-time updates. The admin dashboard allows movie management, revenue tracking, and user control. This project is a great combination of React, Node.js, MongoDB, and various services like Redis, Firebase, and WebSocket.

---

## 🚀 Technologies Used

### 🖥 Frontend:
- [React.js (Vite)](https://vitejs.dev/)
- HTML5 / CSS3

### 🔙 Backend:
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)

### 🗄️ Database:
- [MongoDB](https://www.mongodb.com/)

### 🧰 Other Services:
- [Redis](https://redis.io/)
- [Cloudinary](https://cloudinary.com/) – for image upload & optimization
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) – real-time admin notifications
- [Firebase](https://firebase.google.com/) – authentication & messaging
- [Render](https://render.com/) – for deployment
- [Google OAuth2](https://developers.google.com/identity)
- [MoMo Payment Gateway](https://developers.momo.vn/)

---

## ✨ Key Features

### 👥 User Side:
- ✅ Clean and responsive UI
- 🔍 Browse movies by category
- 🧠 Search and filter movies
- 📄 View detailed movie information
- 🛒 Add to cart and checkout (with MoMo payment)
- 🔐 Login/Signup via Google OAuth2

### 🎛️ Admin Dashboard:
- 🎬 CRUD Movies & Showtimes
- 👤 Manage Users & Tickets
- 📊 Revenue statistics (charts & tables)
- 🛎️ Real-time notifications via WebSocket
- 📦 Upload movie assets using Cloudinary
- 🔐 Firebase security & access control

---

## 🧱 Project Structure

```

project-root/
├── client/               # Frontend (React + Vite)
│   └── src/
│       ├── components/   # Reusable components
│       ├── pages/        # Page components
│       ├── assets/       # Images, CSS
│       └── main.jsx
├── server/               # Backend (Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/         # Redis, MoMo, Cloudinary etc.
│   ├── middleware/
│   └── index.js
├── .env
├── README.md
└── package.json

````

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/movie-web-app.git
cd movie-web-app
````

### 2. Install dependencies

#### Backend:

```bash
cd server
npm install
```

#### Frontend:

```bash
cd ../client
npm install
```

### 3. Create environment variable files

* For backend: `server/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FIREBASE_API_KEY=your_firebase_key
MOMO_PARTNER_CODE=...
MOMO_ACCESS_KEY=...
MOMO_SECRET_KEY=...
```

* For frontend: `client/.env`

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=...
```

### 4. Run the application

#### Backend:

```bash
cd server
node server.js
```

#### Frontend:

```bash
cd client
npm run dev
```

## 🌍 Deployment

The app is deployed on **Render** for backend and **Vercel/Netlify** for frontend.

* 🔗 Live Frontend: [https://movie-client.vercel.app](https://movie-client.vercel.app)
* 🔗 Live Backend API: [https://movie-api.onrender.com](https://movie-api.onrender.com)

---

## 📦 API Integration

* ✅ Google OAuth2 for secure login
* 💳 MoMo Payment Gateway for checkout
* ☁️ Cloudinary for movie poster uploads
* 🔄 WebSocket for live updates in Admin
* 🔐 Firebase Authentication & Messaging

---

## 👨‍💻 Author

* **Nguyen Tien** – Full Stack Developer (Fresher)
* 📧 [tiennguyen@example.com](mailto:tiennguyen@example.com)
* 🐙 [GitHub](https://github.com/your-username)

---

## 🧪 Future Improvements

* Email notifications (via SendGrid or Nodemailer)
* Unit & integration testing with Jest
* Mobile App version using React Native
* Internationalization (i18n)

---

## 📃 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

* [TMDb](https://www.themoviedb.org/) for movie data (optional)
* [Firebase](https://firebase.google.com/)
* [MoMo Vietnam](https://developers.momo.vn/)
* [Render](https://render.com/)

```
