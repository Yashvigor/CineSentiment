// ─── NLP Sentiment Analysis ───────────────────────────────────────────────────
const POSITIVE_WORDS = [
  'amazing', 'brilliant', 'excellent', 'fantastic', 'great', 'love', 'loved', 'wonderful',
  'outstanding', 'incredible', 'masterpiece', 'beautiful', 'perfect', 'best', 'magnificent',
  'superb', 'stunning', 'extraordinary', 'marvelous', 'exceptional', 'impressive', 'powerful',
  'moving', 'gripping', 'captivating', 'compelling', 'riveting', 'heartwarming', 'thrilling',
  'epic', 'genius', 'spectacular', 'unforgettable', 'breathtaking', 'enjoyable', 'entertaining',
  'fun', 'good', 'interesting', 'solid', 'recommended', 'worth', 'unique', 'original', 'clever',
  'smart', 'engaging', 'funny', 'hilarious', 'touching', 'emotional', 'charming', 'delightful',
  'refreshing', 'exciting', 'exhilarating', 'inspiring', 'sublime', 'well-made', 'well-acted',
  'perfect', 'superb', 'flawless', 'phenomenal', 'extraordinary', 'acclaimed', 'celebrated',
];

const NEGATIVE_WORDS = [
  'terrible', 'awful', 'horrible', 'bad', 'worst', 'disappointing', 'boring', 'dull', 'waste',
  'poor', 'weak', 'mediocre', 'pathetic', 'ridiculous', 'stupid', 'nonsense', 'predictable',
  'cliché', 'forgettable', 'uninspired', 'shallow', 'derivative', 'overrated', 'undercooked',
  'mess', 'disaster', 'failure', 'unwatchable', 'painful', 'tedious', 'tiresome', 'annoying',
  'frustrating', 'confusing', 'incoherent', 'disjointed', 'lifeless', 'flat', 'empty', 'hollow',
  'soulless', 'generic', 'formulaic', 'lazy', 'pointless', 'offensive', 'cheap', 'amateurish',
  'clunky', 'forced', 'contrived', 'implausible', 'unbelievable', 'uninteresting', 'slow',
  'draggy', 'plotless', 'convoluted', 'overlong', 'preachy', 'dreadful', 'atrocious', 'abysmal',
  'garbage', 'trash', 'horrid', 'unbearable', 'insufferable', 'lame', 'stale', 'vapid',
];

const NEGATIONS = ['not', "n't", 'no', 'never', 'neither', 'nor', 'barely', 'hardly', 'without'];
const INTENSIFIERS = ['very', 'really', 'extremely', 'incredibly', 'absolutely', 'totally', 'utterly', 'completely', 'deeply', 'truly'];

const analyzeSentiment = (text) => {
  if (!text || typeof text !== 'string') {
    return { sentiment: 'neutral', score: 0, confidence: 50, positive: 50, negative: 50 };
  }

  const lower = text.toLowerCase();
  const tokens = lower.split(/[\s,;!?."'()\[\]{}\-]+/).filter(Boolean);

  let score = 0;
  let posCount = 0;
  let negCount = 0;
  const foundPos = [];
  const foundNeg = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const prev3 = tokens.slice(Math.max(0, i - 3), i);
    const isNegated = prev3.some(t => NEGATIONS.includes(t));
    const prevToken = tokens[i - 1] || '';
    const multiplier = INTENSIFIERS.includes(prevToken) ? 1.5 : 1;

    if (POSITIVE_WORDS.includes(token)) {
      if (isNegated) { score -= multiplier; negCount++; if (!foundNeg.includes(token)) foundNeg.push(token); }
      else { score += multiplier; posCount++; if (!foundPos.includes(token)) foundPos.push(token); }
    } else if (NEGATIVE_WORDS.includes(token)) {
      if (isNegated) { score += 0.5 * multiplier; posCount++; }
      else { score -= multiplier; negCount++; if (!foundNeg.includes(token)) foundNeg.push(token); }
    }
  }

  const total = posCount + negCount || 1;
  const posRatio = Math.round((posCount / total) * 100);
  const negRatio = 100 - posRatio;
  const wordCount = tokens.filter(t => t.length > 2).length || 1;
  const norm = score / Math.sqrt(wordCount);

  let sentiment, confidence;
  if (norm > 0.15) {
    sentiment = 'positive';
    confidence = Math.min(96, 55 + Math.round(norm * 30));
  } else if (norm < -0.15) {
    sentiment = 'negative';
    confidence = Math.min(96, 55 + Math.round(Math.abs(norm) * 30));
  } else {
    sentiment = 'neutral';
    confidence = Math.round(45 + Math.random() * 15);
  }

  return { sentiment, score: norm, confidence, positive: posRatio, negative: negRatio, keywords: { positive: foundPos.slice(0, 5), negative: foundNeg.slice(0, 5) } };
};

const analyzeReviews = (reviews) => {
  if (!reviews?.length) return null;
  const analyzed = reviews.map(r => ({ ...r, analysis: analyzeSentiment(r.text || '') }));
  const pos = analyzed.filter(r => r.analysis.sentiment === 'positive');
  const neg = analyzed.filter(r => r.analysis.sentiment === 'negative');
  const neu = analyzed.filter(r => r.analysis.sentiment === 'neutral');
  const posPercent = Math.round((pos.length / analyzed.length) * 100);
  const negPercent = Math.round((neg.length / analyzed.length) * 100);
  const neuPercent = 100 - posPercent - negPercent;
  const avgConf = Math.round(analyzed.reduce((a, r) => a + r.analysis.confidence, 0) / analyzed.length);

  // Keyword frequencies
  const kwFreq = {};
  analyzed.forEach(r => {
    [...(r.analysis.keywords?.positive || []), ...(r.analysis.keywords?.negative || [])].forEach(kw => {
      kwFreq[kw] = (kwFreq[kw] || { count: 0, sentiment: POSITIVE_WORDS.includes(kw) ? 'positive' : 'negative' });
      kwFreq[kw].count++;
    });
  });
  const topKeywords = Object.entries(kwFreq)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 20)
    .map(([word, data]) => ({ word, count: data.count, sentiment: data.sentiment }));

  return {
    analyzed,
    summary: { positive: posPercent, negative: negPercent, neutral: neuPercent },
    counts: { positive: pos.length, negative: neg.length, neutral: neu.length, total: analyzed.length },
    avgConfidence: avgConf,
    topKeywords,
  };
};

module.exports = { analyzeSentiment, analyzeReviews };
