import { isPinValid } from './pin.js';

const APP_PIN = '2603';
const form = document.querySelector('#pin-form');
const pinInput = document.querySelector('#pin-input');
const toggle = document.querySelector('#toggle-pin');
const error = document.querySelector('#pin-error');
const gate = document.querySelector('#gate');
const dashboard = document.querySelector('#dashboard');

function unlock() {
  gate.hidden = true;
  dashboard.hidden = false;
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (isPinValid(pinInput.value, APP_PIN)) {
    error.textContent = '';
    unlock();
  } else {
    error.textContent = 'PIN incorrect. Réessaie.';
  }
});

toggle?.addEventListener('change', () => {
  pinInput.type = toggle.checked ? 'text' : 'password';
});
