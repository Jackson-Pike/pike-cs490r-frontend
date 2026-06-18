import '../src/index.css';
import '../src/App.css';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { mswHandlers } from './msw-handlers';

initialize({ onUnhandledRequest: 'bypass' });

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  loaders: [mswLoader],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    a11y: {
      test: "todo"
    },
    msw: { handlers: mswHandlers },
  },
};

export default preview;