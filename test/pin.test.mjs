import test from 'node:test';
import assert from 'node:assert/strict';
import { isPinValid } from '../src/pin.js';

test('accept valid pin', () => {
  assert.equal(isPinValid('2603', '2603'), true);
});

test('reject invalid pin', () => {
  assert.equal(isPinValid('1234', '2603'), false);
});
