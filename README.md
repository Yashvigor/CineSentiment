# CineSentiment AI 🎬
A comprehensive, full-stack AI-powered movie sentiment analysis platform designed to analyze IMDB movie reviews and classify audience sentiments while providing a premium cinematic dashboard.

🌐 Overview
CineSentiment enables users to search for movies, fetch real-time metadata, analyze audience reviews using custom NLP techniques, and display comprehensive visual sentiment insights (Positive, Negative, and Neutral) through a centralized analytics dashboard.

✨ Features
- **🔐 Multi-Role Authentication**: Secure login system with JWT-based session management for standard users and administrators.
- **🧠 Custom NLP Sentiment Engine**: Rule-based lexicon model handling tokenization, negations (e.g., *"not great"*), and intensifiers (e.g., *"really good"*) to classify sentiment.
- **🎬 Real-Time Movie Metadata**: Seamless integration with the OMDB API to fetch posters, ratings, runtime, cast, and details.
- **📊 Interactive Analytics Dashboard**: Deep visual insights using Recharts (pie, bar, and line charts) showing global sentiment trends.
- **☁️ Keyword Cloud**: Dynamic visualization of the most frequent review keywords grouped by positive or negative impact.
- **👤 User Profile & Analysis History**: Save searched movies, track historical analyses, and view customized logs.
- **🛡️ Admin Panel**: Admin metrics page showcasing platform performance and analytical model insights.

🛠️ Tech Stack
### Backend
- **Node.js** & **Express.js**
- **MongoDB** (Atlas / Mongoose)
- **JWT Authentication** for route protection
- **bcryptjs** for secure password hashing
- **Axios** for API integrations
- **Cheerio** (installed for advanced DOM parsing)

### Frontend
- **React.js** (Vite)
- **Tailwind CSS v4** for high-fidelity styling
- **Framer Motion** for premium animations
- **Lucide React** for icons
- **Recharts** for data visualization

📁 Project Structure
CineSentiment/
│
├── Backend/
│   ├── config/          # DB connection setup
│   ├── controllers/     # Auth, movie, and review controllers
│   ├── middleware/      # Authentication validation handlers
│   ├── models/          # User, SearchLog, and Analysis schemas
│   ├── routes/          # API routing declarations
│   ├── reviewsData.js   # Local review database & shuffling utilities
│   ├── sentiment.js     # Lexicon NLP engine
│   └── server.js        # Main backend entry point
│
├── Frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI widgets and layout modules
│   │   ├── context/     # React state managers (auth)
│   │   ├── pages/       # Route-level dashboard and page views
│   │   ├── services/    # Axios API service integrations
│   │   ├── App.jsx      # Main application router and core layout
│   │   └── index.css    # Global Tailwind & animations styles
│
└── README.md

⚙️ Getting Started
### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** instance (local or Atlas)
- **OMDB API Key** (Get a free key from [omdbapi.com](http://www.omdbapi.com/))

🔙 Backend Setup
1. **Navigate to backend**
   ```bash
   cd Backend
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Create .env file**
   Create a `.env` file in the `Backend` directory and fill in your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   OMDB_API_KEY=your_omdb_api_key
   ```
4. **Start server**
   ```bash
   npm run dev
   ```

🔜 Frontend Setup
1. **Navigate to frontend**
   ```bash
   cd Frontend
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start development server**
   ```bash
   npm run dev
   ```

🔌 API Endpoints
### Authentication
- `POST /api/auth/register` — User registration
- `POST /api/auth/login` — User authentication
- `GET /api/auth/me` — Retrieve active profile info (Protected)

### Movies
- `GET /api/movies/search?q=title` — Search movie releases by title
- `GET /api/movies/:imdbId` — Retrieve full movie metadata
- `GET /api/movies/trending` — Fetch trending movie listings

### Sentiment & Reviews
- `GET /api/reviews/:imdbId` — Process and return review sentiment analytics
- `GET /api/reviews/history` — Get recent sentiment analyses history (Protected)

🔐 Security
- **Password Hashing**: Secure encryption using bcryptjs before storing credentials.
- **JWT Protection**: Stateless route-level validation for all sensitive API endpoints.
- **MongoDB Injection Prevention**: Safe querying schemas using Mongoose ORM models.
- **Configuration Security**: Safe-loaded environment files to prevent leakage of API keys.
