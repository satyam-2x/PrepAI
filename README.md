# PrepAI

🌐 Live Demo: https://prep-ai-pi-two.vercel.app

💻 GitHub Repo: https://github.com/satyam-2x/PrepAI

## 🎯 Description
PrepAI is an AI-powered interview preparation platform that creates personalized technical interview questions based on the user's resume and target role. It provides AI-driven feedback, session persistence, and an interactive interview experience to help candidates improve performance and prepare confidently for real-world technical interviews.

---

## 🔑 Key Features

### 🤖 AI Interview System
- **Resume-Based Questions:** Generates personalized interview questions from uploaded resumes.
- **Role & Difficulty Selection:** Supports different roles with Easy, Medium, and Hard levels.
- **AI Feedback & Scoring:** Provides interview feedback and performance scores.

---

### 👤 Authentication & Security
- **JWT Authentication:** Secure login and protected routes.
- **OTP Verification:** Email verification during signup.
- **Password Recovery:** Forgot and reset password functionality.
- **Account Management:** Update profile details, change password, and delete account.

---

### 📂 Interview Management
- **Interview History:** Access previous interview sessions and feedback.
- **Daily Credit System:** Limits interview attempts with daily credit reset.

---

### 🎨 User Experience
- **Responsive UI:** Optimized for desktop and mobile devices.
- **Modern Interface:** Clean dashboard with sidebar navigation and smooth workflow.

---

## 🛠️ Tech Stack

### Frontend
- React.js (UI Components)
- Tailwind CSS (Styling)

### Backend
- Node.js
- Express.js
- JWT (Authentication)

### Database
- MongoDB Atlas (NoSQL Database)

### AI & Tools
- Gemini API
- Postman

### Deployment
- Vercel (Frontend Hosting)
- Railway (Backend Hosting)

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/satyam-2x/PrepAI.git
cd PrepAI

# Install server dependencies
npm install --prefix server

# Install frontend dependencies (client)
npm install --prefix client
```

---

## ▶️ Run Project

```bash
# Start server
npm run dev --prefix server

# Start frontend (React app)
npm run dev --prefix client
```

## 🔐 Environment Variables

### Backend (server/.env)

Create a `.env` file inside the server folder and
add:

```env
PORT=8080
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key

# Email Service (optional)
BREVO_API_KEY=your_brevo_api_key
```

---

### Frontend (client/.env)

Create a `.env` file inside the client folder and add:

```env
VITE_API_URL=your_server_url
```

---

### Note

For production, update `VITE_API_URL` with your deployed server URL.
