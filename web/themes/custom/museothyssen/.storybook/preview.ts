import type { Preview } from '@storybook/html';

import '../css/tailwind.css';

import.meta.glob('../components/**/*.css', { eager: true });
import.meta.glob('../components/**/js/*.ts', { eager: true });

function attachDrupalBehaviors(canvasElement: HTMLElement): void {
  if (
    typeof Drupal !== 'undefined' &&
    typeof Drupal.attachBehaviors === 'function'
  ) {
    Drupal.attachBehaviors(canvasElement, window.drupalSettings ?? {});
  }
}

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      const html = Story();
      const container = document.createElement('div');
      container.className =
        'storybook-sdc-preview min-h-[4rem] bg-slate-50 p-6';
      if (typeof html === 'string') {
        container.innerHTML = html;
      } else if (html instanceof HTMLElement) {
        container.append(html);
      }
      queueMicrotask(() => attachDrupalBehaviors(container));
      return container;
    },
  ],
};

export default preview;
