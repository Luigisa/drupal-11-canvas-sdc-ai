/**
 * @file
 * Opciones server Vite compartidas para DDEV (*.ddev.site).
 *
 * @see https://docs.ddev.com/en/stable/users/usage/vite/
 * @see https://vite.dev/config/server-options.html#server-allowedhosts
 */
import type { UserConfig } from 'vite';

/** Host check Vite 6+ — sin esto: "Invalid host" en :5173 / :6006 vía DDEV. */
export const ddevAllowedHosts = ['.ddev.site', 'localhost', '127.0.0.1'] as const;

export function viteServerForDdev(port: number): UserConfig['server'] {
  return {
    host: '0.0.0.0',
    port,
    strictPort: true,
    // true en DDEV: Vite 6 host-check + proxy router; lista suffix a veces no basta tras merge.
    allowedHosts: process.env.DDEV_PROJECT ? true : [...ddevAllowedHosts],
    ...(process.env.DDEV_PRIMARY_URL_WITHOUT_PORT && {
      origin: `${process.env.DDEV_PRIMARY_URL_WITHOUT_PORT}:${port}`,
    }),
    cors: {
      origin: /https?:\/\/([A-Za-z0-9\-.]+)?(\.ddev\.site)(?::\d+)?$/,
    },
  };
}
