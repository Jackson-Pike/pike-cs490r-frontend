// Fetches all movies from the live backend, enriches each with a real poster
// URL from OMDB, then writes a complete seed.js to stdout that can be dropped
// into the backend repo.
//
// Usage:
//   node scripts/fetch-posters-and-gen-seed.mjs > ../../../final-project-Jackson-Pike/seed.js

import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const BACKEND_URL = 'http://localhost:3000/api/movies'
const OMDB_API_KEY = 'dd8f30b0'
const OMDB_URL = 'https://www.omdbapi.com/'
const OUT_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../../final-project-Jackson-Pike/seed.js'
)

// ── 1. Fetch movies ──────────────────────────────────────────────────────────
console.error('Fetching movies from backend...')
const moviesRes = await fetch(BACKEND_URL)
if (!moviesRes.ok) throw new Error(`Backend responded ${moviesRes.status}`)
const movies = await moviesRes.json()
console.error(`Found ${movies.length} movies.`)

// ── 2. Look up OMDB for each title ──────────────────────────────────────────
const enriched = []
for (const movie of movies) {
  const url = `${OMDB_URL}?t=${encodeURIComponent(movie.title)}&apikey=${OMDB_API_KEY}`
  const omdbRes = await fetch(url)
  const omdb = await omdbRes.json()

  let poster_url = movie.poster_url ?? null
  if (omdb.Response === 'True' && omdb.Poster && omdb.Poster !== 'N/A') {
    poster_url = omdb.Poster
    console.error(`  ✓ ${movie.title}`)
  } else {
    console.error(`  ✗ ${movie.title} — no OMDB poster (keeping existing)`)
  }

  enriched.push({ ...movie, poster_url })
}

// ── 3. Build the movies array literal ───────────────────────────────────────
function movieToLiteral(m) {
  const date = m.releaseDate ? new Date(m.releaseDate).toISOString().split('T')[0] : null
  return `  {
    title: ${JSON.stringify(m.title)},
    synopsis: ${JSON.stringify(m.synopsis ?? '')},
    releaseDate: new Date(${JSON.stringify(date)}),
    runtime: ${m.runtime ?? 'undefined'},
    maturity_rating: ${JSON.stringify(m.maturity_rating ?? '')},
    poster_url: ${JSON.stringify(m.poster_url ?? '')},
    genre: ${JSON.stringify(m.genre ?? '')},
    director: ${JSON.stringify(m.director ?? '')},
  }`
}

const moviesLiteral = enriched.map(movieToLiteral).join(',\n')

// ── 4. Read the existing seed reviews + users verbatim ───────────────────────
// We keep all review/user data as-is — only the movies array changes.
const REVIEW_BLOCK = `// u0–u4 are placeholder indices into the seeded users array; resolved at runtime.
const reviewsData = [
  // Action — Mad Max: Fury Road
  [
    { _u: 0, rating: 10, review_text: 'An absolute adrenaline rush from start to finish. George Miller reinvented the action genre with this masterpiece.' },
    { _u: 1, rating: 9,  review_text: 'The practical effects and chase sequences are jaw-dropping. Charlize Theron steals every scene she is in.' },
    { _u: 2, rating: 8,  review_text: 'Visually stunning and relentlessly paced. A few narrative gaps keep it just below perfect.' },
    { _u: 3, rating: 10, review_text: 'I have seen it five times and still find something new every watch. A landmark film of the decade.' },
  ],
  // Drama — The Shawshank Redemption
  [
    { _u: 4, rating: 10, review_text: 'Perhaps the greatest film ever made. Morgan Freeman and Tim Robbins deliver career-defining performances.' },
    { _u: 0, rating: 10, review_text: 'A timeless story about hope that gets better with every viewing. Absolutely essential cinema.' },
    { _u: 1, rating: 9,  review_text: 'Deeply moving and beautifully acted. The slow pace is purposeful and pays off tremendously.' },
    { _u: 2, rating: 8,  review_text: 'An emotionally powerful drama. A little long but completely worth every minute.' },
    { _u: 3, rating: 9,  review_text: 'The ending never fails to give me chills no matter how many times I watch it.' },
  ],
  // Sci-Fi — Inception
  [
    { _u: 4, rating: 9,  review_text: 'Mind-bending and visually spectacular. Nolan at his most ambitious and inventive best.' },
    { _u: 0, rating: 7,  review_text: 'Complex to a fault on first watch, but the action set pieces are genuinely thrilling.' },
    { _u: 1, rating: 10, review_text: 'A rare blockbuster that treats its audience as intelligent. The final shot haunts me still.' },
    { _u: 2, rating: 8,  review_text: 'DiCaprio anchors the film beautifully. The rotating hallway fight remains one of cinema\\'s best sequences.' },
  ],
  // Comedy — Superbad
  [
    { _u: 3, rating: 9, review_text: 'Hilarious and surprisingly heartfelt. Jonah Hill and Michael Cera have incredible chemistry.' },
    { _u: 4, rating: 8, review_text: 'One of the funniest comedies of its generation. The McLovin subplot alone earns a perfect score.' },
    { _u: 0, rating: 7, review_text: 'Very funny but slightly uneven in the third act. Still a great time from beginning to end.' },
  ],
  // Thriller — Gone Girl
  [
    { _u: 1, rating: 9,  review_text: 'Rosamund Pike is terrifying in the best possible way. Fincher\\'s cold direction matches the material perfectly.' },
    { _u: 2, rating: 8,  review_text: 'A razor-sharp thriller with a savage commentary on marriage and media. Deeply unsettling and satisfying.' },
    { _u: 3, rating: 6,  review_text: 'Well-crafted but I found the characters too unlikable to fully invest in. Still worth watching for Pike\\'s performance.' },
    { _u: 4, rating: 9,  review_text: 'The twist reframes everything you saw before. Fincher never lets you feel comfortable for a second.' },
    { _u: 0, rating: 10, review_text: 'Every frame is meticulously composed. One of the best adapted screenplays in recent memory.' },
  ],
  // Horror — Hereditary
  [
    { _u: 1, rating: 9,  review_text: 'The most genuinely disturbing horror film in years. Toni Collette deserved every award going.' },
    { _u: 2, rating: 7,  review_text: 'Brilliantly atmospheric but the third act veers into territory that will not work for everyone.' },
    { _u: 3, rating: 10, review_text: 'Ari Aster announced himself as a major talent. The dread builds slowly and then hits you like a freight train.' },
    { _u: 4, rating: 8,  review_text: 'Equal parts family tragedy and supernatural nightmare. The dinner table scene alone makes it essential viewing.' },
  ],
  // Romance — Pride & Prejudice
  [
    { _u: 0, rating: 9,  review_text: 'Keira Knightley is radiant and Matthew Macfadyen brings real depth to Darcy. A beautiful adaptation.' },
    { _u: 1, rating: 8,  review_text: 'The cinematography is lush and the dialogue crackles. One of the best period romances ever filmed.' },
    { _u: 2, rating: 10, review_text: 'Captures the wit and emotional truth of Austen\\'s novel while making it feel completely alive and modern.' },
    { _u: 3, rating: 7,  review_text: 'Gorgeous production design and strong performances, though some subplots feel rushed.' },
  ],
  // Animation — Spider-Man: Into the Spider-Verse
  [
    { _u: 4, rating: 10, review_text: 'Revolutionized animated filmmaking. Every frame looks like a comic panel brought to life with jaw-dropping artistry.' },
    { _u: 0, rating: 10, review_text: 'The best Spider-Man film ever made, animated or otherwise. Miles Morales is a hero for the ages.' },
    { _u: 1, rating: 9,  review_text: 'An emotional, visually inventive triumph. The animation style alone is worth the price of admission.' },
    { _u: 2, rating: 8,  review_text: 'Funny, heartfelt, and visually unlike anything else. Spider-Man Noir alone deserved his own film.' },
    { _u: 3, rating: 9,  review_text: 'A masterclass in how to respect source material while doing something completely fresh and exciting.' },
  ],
  // Documentary — Free Solo
  [
    { _u: 4, rating: 10, review_text: 'I have never felt more anxious watching a film. Alex Honnold is either the bravest or craziest person alive.' },
    { _u: 0, rating: 9,  review_text: 'A documentary that doubles as an intimate character study. The climbing footage defies belief.' },
    { _u: 1, rating: 8,  review_text: 'Spectacular filmmaking that raises genuine ethical questions about the price of ambition. Essential viewing.' },
  ],
  // Fantasy — The Lord of the Rings: The Fellowship of the Ring
  [
    { _u: 2, rating: 10, review_text: 'Peter Jackson\\'s achievement cannot be overstated. He brought Tolkien\\'s world to life with breathtaking fidelity.' },
    { _u: 3, rating: 10, review_text: 'An epic journey that still feels magical over two decades later. The score by Howard Shore is perfection.' },
    { _u: 4, rating: 9,  review_text: 'Sets up the trilogy beautifully while telling a complete and satisfying story in its own right.' },
    { _u: 0, rating: 8,  review_text: 'Some scenes drag slightly but the world-building is unmatched. Gandalf\\'s confrontation in the mines is unforgettable.' },
  ],
];`

// ── 5. Assemble and write seed.js ────────────────────────────────────────────
const output = `require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Review = require('./models/Review');
const User = require('./models/User');

const movies = [
${moviesLiteral}
];

${REVIEW_BLOCK}

const seedUsers = [
  { username: 'alice_seeds',  email: 'alice@seed.dev',  password: 'seedpass1', first_name: 'Alice',  last_name: 'Nguyen' },
  { username: 'bob_seeds',    email: 'bob@seed.dev',    password: 'seedpass2', first_name: 'Bob',    last_name: 'Okafor' },
  { username: 'carol_seeds',  email: 'carol@seed.dev',  password: 'seedpass3', first_name: 'Carol',  last_name: 'Park'   },
  { username: 'david_seeds',  email: 'david@seed.dev',  password: 'seedpass4', first_name: 'David',  last_name: 'Reyes'  },
  { username: 'evelyn_seeds', email: 'evelyn@seed.dev', password: 'seedpass5', first_name: 'Evelyn', last_name: 'Moss'   },
];

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected.');

  console.log('Wiping existing data...');
  await User.deleteMany({});
  await Movie.deleteMany({});
  await Review.deleteMany({});
  console.log('Existing data cleared.');

  console.log('Seeding users...');
  const insertedUsers = [];
  for (const userData of seedUsers) {
    const user = new User({ ...userData, provider: 'local', role: 'user' });
    await user.save();
    insertedUsers.push(user);
  }
  console.log(\`Created \${insertedUsers.length} users.\`);

  console.log('Seeding movies...');
  const insertedMovies = await Movie.insertMany(movies);
  console.log(\`Created \${insertedMovies.length} movies.\`);

  let totalReviews = 0;
  for (let i = 0; i < insertedMovies.length; i++) {
    const movie = insertedMovies[i];
    const reviews = reviewsData[i].map(({ _u, ...rest }) => ({
      ...rest,
      movie_id: movie._id,
      user_id:  insertedUsers[_u]._id,
    }));
    console.log(\`Seeding reviews for \${movie.title}...\`);
    const inserted = await Review.insertMany(reviews);
    totalReviews += inserted.length;
  }

  console.log(\`Done. \${insertedUsers.length} users, \${insertedMovies.length} movies, \${totalReviews} reviews seeded.\`);
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

main().catch(console.error);
`

writeFileSync(OUT_PATH, output)
console.error(`\nWrote seed.js → ${OUT_PATH}`)
