import { isPinValid } from './pin.js';

const APP_PIN = '2603';
const model = {
  progressPct: 18,
  globalState: 'En cours — CI verte sur la passe 1',
  nextStep: 'Merge PASS-01 puis implémenter la Vue Rapide complète.',
  alerts: 'Aucune alerte critique.',
  shortStatus: [
    'On en est à peu près à 18 % du développement.',
    'Pas de problème que l’on ne puisse gérer.',
    'Prochaine étape : Passe 02 (Vue Rapide + avancement visuel).'
  ]
};

const form = document.querySelector('#pin-form');
const pinInput = document.querySelector('#pin-input');
const toggle = document.querySelector('#toggle-pin');
const error = document.querySelector('#pin-error');
const gate = document.querySelector('#gate');
const dashboard = document.querySelector('#dashboard');

function renderQuickView() {
  const pct = Math.max(0, Math.min(100, Number(model.progressPct || 0)));
  document.querySelector('#kpi-progress-value').textContent = `${pct}%`;
  document.querySelector('#kpi-progress-bar').style.width = `${pct}%`;
  document.querySelector('#kpi-state').textContent = model.globalState;
  document.querySelector('#kpi-next').textContent = model.nextStep;
  document.querySelector('#kpi-alerts').textContent = model.alerts;
  const status = document.querySelector('#short-status');
  status.innerHTML = '';
  for (const line of model.shortStatus) {
    const li = document.createElement('li');
    li.textContent = line;
    status.appendChild(li);
  }
}

function unlock() {
  gate.hidden = true;
  dashboard.hidden = false;
  renderQuickView();
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
