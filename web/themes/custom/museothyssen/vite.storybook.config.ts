/**
 * @file
 * Vite mínimo solo para Storybook (no uebertool / no dist de Drupal).
 *
 * Storybook usa este archivo en lugar de vite.config.ts para no mezclar
 * librerías Drupal con assets de Storybook.
 */
import { defineConfig } from 'vite';

export default defineConfig({});
