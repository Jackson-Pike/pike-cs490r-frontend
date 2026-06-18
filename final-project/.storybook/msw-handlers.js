import { http, HttpResponse } from 'msw';

const sampleMovies = [
  {
    _id: '1',
    title: 'The Matrix',
    director: 'The Wachowskis',
    genre: 'Sci-Fi',
    releaseDate: '1999-03-31T00:00:00.000Z',
    synopsis: 'A hacker discovers the world is a simulation.',
    runtime: 136,
    maturity_rating: 'R',
    poster_url: 'https://placehold.co/150x220?text=The+Matrix',
  },
  {
    _id: '2',
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi',
    releaseDate: '2010-07-16T00:00:00.000Z',
    synopsis: 'A thief enters dreams to plant an idea.',
    runtime: 148,
    maturity_rating: 'PG-13',
    poster_url: 'https://placehold.co/150x220?text=Inception',
  },
];

export const mswHandlers = {
  movies: [
    http.get('http://localhost:3000/api/movies', () =>
      HttpResponse.json(sampleMovies)
    ),
  ],
};
