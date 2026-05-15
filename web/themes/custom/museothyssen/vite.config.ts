import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import uebertool from '@ueberbit/vite-plugin-drupal';
import { viteServerForDdev } from './vite.ddev-server';

const themeRoot = path.dirname(fileURLToPath(import.meta.url));

/** Storybook carga vite.config.ts del theme; uebertool aquí rompe URLs de assets. */
function isStorybookProcess(): boolean {
  return (
    process.env.STORYBOOK === 'true' ||
    (process.env.npm_lifecycle_script?.includes('storybook') ?? false) ||
    process.argv.some((arg) => arg.includes('storybook'))
  );
}

export default defineConfig({
  plugins: isStorybookProcess() ? [] : [uebertool()],
  // DDEV: exponer Vite en :5173 vía web_extra_exposed_ports (ver .ddev/config.yaml).
  ...(isStorybookProcess() ? {} : { server: viteServerForDdev(5173) }),
  resolve: {
    alias: {
      '@utils': path.resolve(themeRoot, 'js/utils'),
      '@services': path.resolve(themeRoot, 'js/services'),
      '@shared': path.resolve(themeRoot, 'js/shared'),
    },
  },
});
