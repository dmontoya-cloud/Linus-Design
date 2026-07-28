import type { Preview } from '@storybook/react-vite'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Fails a story (and CI via test-storybook) on serious/critical axe violations.
    a11y: {
      test: 'error',
    },
    backgrounds: {
      options: {
        light: { name: 'light', value: '#ffffff' },
        surfaceAlt: { name: 'surface-alt', value: '#f5f7fa' },
      },
    },
  },
}

export default preview
