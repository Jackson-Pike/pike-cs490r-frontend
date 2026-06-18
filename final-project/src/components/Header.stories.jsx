import { expect } from 'storybook/test';
import PikeHeader from './Header';

const meta = {
  component: PikeHeader,
  tags: ['ai-generated'],
};

export default meta;

export const Default = {
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', { name: /pikedb/i });
    await expect(heading).toBeVisible();
  },
};

export const CssCheck = {
  play: async ({ canvas }) => {
    const header = canvas.getByRole('banner');
    // .header has background-color: #1a1a1a — fails if App.css did not load
    await expect(getComputedStyle(header).backgroundColor).toBe('rgb(26, 26, 26)');
  },
};
