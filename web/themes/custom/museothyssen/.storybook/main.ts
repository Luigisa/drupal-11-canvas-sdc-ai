import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/html-vite';
import { viteServerForDdev } from '../vite.ddev-server.ts';

const themeRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

const config: StorybookConfig = {
  stories: ['../components/**/*.component.yml'],
  // Storybook 10 valida Host aparte de Vite; sin esto → "Invalid host" en *.ddev.site:6006
  core: {
    allowedHosts: process.env.DDEV_PROJECT
      ? ['.ddev.site', 'drupal-sdc.ddev.site']
      : true,
  },
  addons: [
    '@storybook/addon-a11y',
    {
      name: 'storybook-addon-sdc',
      options: {
        sdcStorybookOptions: {
          twigLib: 'twing',
          namespace: 'museothyssen',
          validate: false,
          namespaces: {
            museothyssen: themeRoot,
            canvas: path.join(themeRoot, '.storybook/stubs/canvas'),
          },
          externalDefs: [
            path.join(themeRoot, '.storybook/defs/canvas-image.schema.yml'),
          ],
        },
        vitePluginTwingDrupalOptions: {
          hooks: path.join(themeRoot, '.storybook/twing-hooks.ts'),
        },
      },
    },
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {
      viteConfigPath: path.join(themeRoot, 'vite.storybook.config.ts'),
    },
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    const tailwindcss = (await import('@tailwindcss/vite')).default;

    // No re-spread config.plugins en mergeConfig: Vite concatena arrays → plugins
    // de Storybook duplicados → transformIndexHtml doble → /@id/__x00__ duplicado.
    config.plugins = (config.plugins ?? []).filter((plugin) => {
      if (!plugin || typeof plugin !== 'object') {
        return true;
      }
      const name = 'name' in plugin ? String(plugin.name) : '';
      return !name.includes('uebertool') && !name.includes('vite-plugin-drupal');
    });

    return mergeConfig(config, {
      plugins: [tailwindcss()],
      server: viteServerForDdev(6006),
      resolve: {
        alias: {
          '@utils': path.resolve(themeRoot, 'js/utils'),
          '@services': path.resolve(themeRoot, 'js/services'),
          '@shared': path.resolve(themeRoot, 'js/shared'),
        },
      },
    });
  },
};

export default config;
