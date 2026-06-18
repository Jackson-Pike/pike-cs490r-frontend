import { expect } from 'storybook/test';
import MovieCard from './MovieCard';

const meta = {
  component: MovieCard,
  tags: ['ai-generated'],
};

export default meta;

const baseMovie = {
  _id: '1',
  title: 'The Matrix',
  director: 'The Wachowskis',
  genre: 'Sci-Fi',
  releaseDate: '1999-03-31T00:00:00.000Z',
  synopsis: 'A hacker discovers the world is a simulation.',
  runtime: 136,
  maturity_rating: 'R',
  poster_url: 'https://placehold.co/150x220?text=The+Matrix',
};

export const Default = {
  args: { movie: baseMovie },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('The Matrix')).toBeVisible();
    await expect(canvas.getByText('The Wachowskis')).toBeVisible();
    await expect(canvas.getByText('Sci-Fi')).toBeVisible();
  },
};

export const PGThirteen = {
  args: {
    movie: {
      ...baseMovie,
      _id: '2',
      title: 'Inception',
      director: 'Christopher Nolan',
      releaseDate: '2010-07-16T00:00:00.000Z',
      synopsis: 'A thief enters dreams to plant an idea.',
      runtime: 148,
      maturity_rating: 'PG-13',
      poster_url: 'https://placehold.co/150x220?text=Inception',
    },
  },
};

export const LongSynopsis = {
  args: {
    movie: {
      ...baseMovie,
      _id: '3',
      synopsis:
        'In a future where a special police unit is able to arrest murderers before they commit their crimes, an officer from that unit is himself accused of a future murder. A visually stunning neo-noir science fiction thriller.',
    },
  },
};

export const NoImage = {
  args: {
    movie: {
      ...baseMovie,
      _id: '4',
      poster_url: '',
    },
  },
};
