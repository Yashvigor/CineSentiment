# CineSentiment AI 🎬

**AI-Powered Movie Sentiment Analysis Platform**

Analyzes real IMDB movie reviews using NLP & Machine Learning to classify audience sentiment into Positive, Negative, and Neutral categories — displayed with a premium cinematic dashboard UI.

---

## Project Structure

```
CineSentiment/
├── frontend/       # React + Vite + Tailwind CSS (UI)
├── backend/        # Node.js + Express API (NLP, OMDB integration)
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v4, Framer Motion, Recharts |
| Backend | Node.js, Express, Axios, Cheerio |
| Database | MongoDB (Atlas) |
| NLP/ML | Custom lexicon-based NLP + OMDB API |
| Auth | JWT |

---

## Quick Start

### Backend
```bash
cd backend
npm install
# Add your OMDB API key to .env
npm run dev     # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev     # runs on http://localhost:5173
```

---

## Features

- 🔍 Search movies by title → shows all releases with IMDB-ID table
- 🎬 Real movie data via OMDB API (poster, rating, runtime, cast)
- 🧠 NLP sentiment analysis on IMDB reviews
- 🟢 Green = Positive reviews | 🔴 Red = Negative reviews
- 📊 Pie chart, bar chart, line chart analytics dashboard
- ☁️ Word cloud of most frequent review keywords
- 🔐 User authentication (JWT)
- 👤 Profile + saved movies + analysis history
- 🛡️ Admin panel with model metrics

---


