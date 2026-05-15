/**
 * @file
 * Ajustes tras vite build (el plugin referencia css__gin-custom sin existir en este theme).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const themeRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const infoPath = path.join(themeRoot, 'dist', 'museothyssen_dist.info.yml');

if (fs.existsSync(infoPath)) {
  const yaml = fs.readFileSync(infoPath, 'utf8');
  fs.writeFileSync(
    infoPath,
    yaml.replace(/\s*- museothyssen_dist\/css__gin-custom\n/, '\n'),
  );
}
