/**
 * @file
 * Parche postinstall: storybook-addon-sdc + carpetas atoms|molecules|organisms.
 *
 * pathToNamespace(..., true) usaba rel completo → data-component-id museothyssen:atoms/foo
 * (Drupal espera museothyssen:foo). basename(fsPath) alinea con SDC real.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const themeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const preset = path.join(themeRoot, 'node_modules/storybook-addon-sdc/dist/preset.js');

if (!fs.existsSync(preset)) {
  process.exit(0);
}

const from = `      if (makeComponentIdFormat) {
        return \`\${ns}:\${rel}\`;
      }`;
const to = `      if (makeComponentIdFormat) {
        return \`\${ns}:\${basename2(fsPath)}\`;
      }`;

let s = fs.readFileSync(preset, 'utf8');
if (s.includes(to)) {
  process.exit(0);
}
if (!s.includes(from)) {
  console.warn('[patch-storybook-sdc-nested] formato dist/preset.js distinto, omito parche');
  process.exit(0);
}
s = s.replace(from, to);
fs.writeFileSync(preset, s);
console.log('[patch-storybook-sdc-nested] OK: makeComponentIdFormat usa basename del directorio SDC');
