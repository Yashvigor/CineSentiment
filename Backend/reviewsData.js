const cheerio = require('cheerio');
const axios = require('axios');

// CineSentiment AI — Mock IMDB Reviews per movie
// Used as fallback when real scraping is unavailable or rate-limited
const REVIEW_DB = {
  default: [
    { id: 1, author: 'CinemaPhile88', rating: 10, date: '2024-01-15', text: 'An absolutely brilliant masterpiece. The direction is incredible and the lead performance is the most stunning, unforgettable acting witnessed in years. The film is gripping from start to finish, with a compelling and thought-provoking story. Perfect in every way.' },
    { id: 2, author: 'MovieCritic_Pro', rating: 9, date: '2024-02-03', text: 'This is an exceptional film that transcends its genre entirely. The cinematography is beautiful, the score is powerful and moving, and the performances are extraordinary. Highly recommended for any serious film lover.' },
    { id: 3, author: 'ArtHouseFan', rating: 8, date: '2024-01-28', text: 'A very solid film that delivers great entertainment. The acting is good and the story is engaging. Some scenes are slightly predictable but overall an enjoyable and well-made cinematic experience.' },
    { id: 4, author: 'CasualViewer99', rating: 4, date: '2024-02-10', text: 'I found this film quite disappointing and boring. The plot is convoluted and confusing. The pacing is slow and the film feels too long. Some performances are weak and the dialogue is often clunky and forced. Not the masterpiece everyone claims.' },
    { id: 5, author: 'FilmNerd_2024', rating: 7, date: '2024-01-20', text: 'A good film with some great moments and interesting ideas. The story is engaging and the action sequences are thrilling. The third act feels slightly rushed but overall this is an entertaining and well-crafted movie worth watching.' },
    { id: 6, author: 'NegativeNancy', rating: 2, date: '2024-03-01', text: 'Terrible, overrated garbage. The plot is ridiculous and makes no sense. The characters are shallow and boring. The film is way too long and painfully tedious. I was bored throughout. A complete waste of time and money.' },
    { id: 7, author: 'PositivePete', rating: 10, date: '2024-03-05', text: 'The most amazing, captivating and unforgettable film ever made. Every scene is beautiful and perfectly crafted. The acting from every cast member is sublime. A true cinematic masterpiece that everyone should experience at least once.' },
    { id: 8, author: 'PopcornLover', rating: 6, date: '2024-02-20', text: 'A fun and entertaining movie with good action. Not the deepest film but enjoyable. The sequences are exciting and visually impressive. A solid blockbuster experience worth watching once.' },
    { id: 9, author: 'StrictCritic', rating: 3, date: '2024-03-10', text: 'Overlong and overhyped. The film tries too hard to be deep but ends up feeling pretentious and hollow. The pacing is dreadful and many scenes are unnecessarily boring. The story is mediocre and derivative. Very disappointing.' },
    { id: 10, author: 'FilmSchoolGrad', rating: 9, date: '2024-03-15', text: 'From a technical standpoint, this is an incredible achievement. The cinematography, editing, and sound design are all top-notch. The direction is brilliant and the performances outstanding. A genuinely great film.' },
    { id: 11, author: 'ActionFan2024', rating: 8, date: '2024-03-20', text: 'Incredible action sequences and brilliant visual effects. The story keeps you on the edge of your seat throughout. Outstanding performances from the entire cast. A must-see cinematic experience that delivers on every level.' },
    { id: 12, author: 'CriticalEye', rating: 5, date: '2024-03-25', text: 'Average film with some good moments. Not great, not terrible. The first half is interesting but the second half drags significantly. The ending feels forced and the character development is thin. A mediocre effort overall.' },
  ],
  tt0468569: [ // Dark Knight
    { id: 1, author: 'GothamFan', rating: 10, date: '2024-01-10', text: 'Heath Ledger\'s Joker is absolutely legendary and phenomenal. An incredible masterpiece of modern cinema. Nolan\'s direction is flawless, the story is compelling, the action is thrilling. Simply the greatest superhero film ever made.' },
    { id: 2, author: 'DCComicsLover', rating: 9, date: '2024-01-20', text: 'A brilliant film that elevates the superhero genre to extraordinary heights. The performances are outstanding especially Ledger. Beautifully shot, brilliantly written, powerfully moving. One of the best films of the 2000s.' },
    { id: 3, author: 'MovieBuff101', rating: 3, date: '2024-02-05', text: 'I honestly don\'t understand the hype. The film is overly long, the plot is unnecessarily convoluted and the pacing is terrible in the third act. The Joker scenes are great but everything else is boring and mediocre.' },
    { id: 4, author: 'CinemaVault', rating: 10, date: '2024-02-15', text: 'Stunning visuals, gripping storyline, unforgettable performance. This film is a masterpiece of storytelling. Nolan creates an epic, emotional, thrilling experience that stays with you long after the credits roll. Absolutely perfect.' },
    { id: 5, author: 'HarshReviewer', rating: 2, date: '2024-03-01', text: 'Terrible pacing and a ridiculous plot with too many unnecessary subplots. The film is bloated and boring. The characters are shallow and the dialogue is awful. I cannot believe this is so highly rated. Completely overrated garbage.' },
    { id: 6, author: 'FilmEnthusiast', rating: 8, date: '2024-03-10', text: 'A solid and very entertaining film. Great performances, fantastic score, impressive action sequences. While not without flaws, this is an excellent piece of commercial cinema that delivers real emotional weight and intellectual depth.' },
  ],
  tt1375666: [ // Inception
    { id: 1, author: 'DreamWeaver', rating: 10, date: '2024-01-05', text: 'Absolutely mind-blowing. Nolan has created an extraordinary, original, brilliant film. The concept is fascinating, the execution is perfect, and the performances are excellent. A truly spectacular cinematic achievement unlike anything else.' },
    { id: 2, author: 'ScienceFiend', rating: 8, date: '2024-01-18', text: 'Very good film with a clever concept and great visuals. The action sequences are thrilling and the performances solid. The emotional core is surprisingly moving and the ending is unforgettable. Highly recommended.' },
    { id: 3, author: 'ConfusedViewer', rating: 4, date: '2024-02-10', text: 'Too confusing and convoluted. I couldn\'t follow the plot at all. The film is boring in parts and tries too hard to be deep but ends up feeling pretentious and hollow. The pacing is dreadful and many scenes are unnecessarily boring. The story is mediocre and derivative. Very disappointing.' },
    { id: 4, author: 'NightDreamer', rating: 9, date: '2024-02-28', text: 'A stunning masterpiece of imagination and technical filmmaking. The layers of dreams create a brilliantly complex narrative. Hans Zimmer\'s score is powerful and moving. DiCaprio gives a great performance. Amazing film.' },
  ],
};

const scrapeIMDbReviews = async (imdbId) => {
  try {
    const url = `https://www.imdb.com/title/${imdbId}/reviews`;
    
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      timeout: 6000
    });

    const $ = cheerio.load(data);
    const reviews = [];

    $('.imdb-user-review').each((i, el) => {
      if (i >= 15) return; // Cap at top 15 reviews
      
      const author = $(el).find('.display-name-link a').text().trim() || 'Anonymous';
      const title = $(el).find('.title').text().trim() || '';
      const text = $(el).find('.text.show-more__control').text().trim();
      const ratingText = $(el).find('.rating-other-user-rating span').first().text().trim();
      const rating = parseInt(ratingText) || null;
      const date = $(el).find('.review-date').text().trim() || new Date().toISOString().split('T')[0];

      if (text) {
        reviews.push({
          id: i + 1,
          author,
          rating,
          date,
          text: title ? `${title}. ${text}` : text
        });
      }
    });

    return reviews.length > 0 ? reviews : null;
  } catch (err) {
    console.warn(`⚠️ Live IMDb scraper bypassed for ${imdbId} (using local shuffler fallback):`, err.message);
    return null;
  }
};

const getReviewsForMovie = async (imdbId, title) => {
  // 1. Attempt live web scraping first
  const liveReviews = await scrapeIMDbReviews(imdbId);
  if (liveReviews) return liveReviews;

  // 2. Fall back to local mock databases
  const key = imdbId?.toLowerCase();
  if (REVIEW_DB[key]) return REVIEW_DB[key];

  // 3. Generate seed shuffled templates for other titles
  const seed = (title || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = REVIEW_DB.default;
  const shuffled = [...base].sort((a, b) => ((a.id * seed) % 7) - ((b.id * seed) % 7));
  
  return shuffled;
};

module.exports = { getReviewsForMovie };
