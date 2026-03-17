import { mkdir, cp } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await cp('index.html', 'dist/index.html');
await cp('manifest.webmanifest', 'dist/manifest.webmanifest');
await mkdir('dist/src', { recursive: true });
await cp('src/main.js', 'dist/src/main.js');
await cp('src/api.js', 'dist/src/api.js');
await cp('src/pin.js', 'dist/src/pin.js');
console.log('build: ok');
