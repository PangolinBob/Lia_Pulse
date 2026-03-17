import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePin } from '../src/pin.js';

test('normalize PIN trims spaces', () => {
  assert.equal(normalizePin(' 1234 '), '1234');
});

test('normalize PIN handles empty value', () => {
  assert.equal(normalizePin(), '');
});
