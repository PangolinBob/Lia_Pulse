import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile('index.html', 'utf8');
const js = await readFile('src/main.js', 'utf8');
const api = await readFile('src/api.js', 'utf8');

test('Scénario 1: ouverture + PIN + statut global (structure)', () => {
  assert.match(html, /id="pin-form"/);
  assert.match(html, /id="pin-input"/);
  assert.match(html, /id="kpi-state"/);
  assert.match(js, /verifyPin\(/);
  assert.match(api, /\/api\/auth\/pin/);
});

test('Scénario 2: blocage dur + bannière persistante + fiche décision (structure)', () => {
  assert.match(html, /id="block-banner"/);
  assert.match(html, /id="block-open"/);
  assert.match(html, /id="block-card"/);
  assert.match(html, /Option A/);
  assert.match(html, /Option B/);
  assert.match(html, /id="decision-a"/);
  assert.match(html, /id="decision-b"/);
  assert.match(js, /window\.confirm\(/);
});

test('Scénario 3: refresh manuel + auto-refresh 2 min (structure)', () => {
  assert.match(html, /id="refresh-btn"/);
  assert.match(html, /id="freshness"/);
  assert.match(js, /REFRESH_MS\s*=\s*120000/);
  assert.match(js, /setInterval\(/);
});
