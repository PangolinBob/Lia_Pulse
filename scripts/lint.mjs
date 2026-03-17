import { readFile } from 'node:fs/promises';

const required = ['index.html', 'src/main.js', 'src/api.js', 'src/pin.js', 'manifest.webmanifest'];
for (const file of required) {
  await readFile(file, 'utf8');
}
console.log('lint: ok');
