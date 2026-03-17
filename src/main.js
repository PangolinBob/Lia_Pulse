import { isPinValid } from './pin.js';

const APP_PIN = '2603';
const REFRESH_MS = 120000;
let refreshTimer = null;

const model = {
  progressPct: 50,
  globalState: 'En cours — passe 3 active',
  nextStep: 'Finaliser refresh manuel + auto-refresh 2 min.',
  alerts: 'Aucune alerte critique.',
  shortStatus: [
    'On en est à peu près à 50 % du développement.',
    'Pas de problème que l’on ne puisse gérer.',
    'Prochaine étape : onglet Détails + historique 5 passes.'
  ]
};

const form = document.querySelector('#pin-form');
const pinInput = document.querySelector('#pin-input');
const toggle = document.querySelector('#toggle-pin');
const error = document.querySelector('#pin-error');
const gate = document.querySelector('#gate');
const dashboard = document.querySelector('#dashboard');
const refreshBtn = document.querySelector('#refresh-btn');
const freshness = document.querySelector('#freshness');

function stampFreshness(mode = 'auto') {
  const when = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  freshness.textContent = `Dernière mise à jour: ${when} (${mode})`;
}

function fakeFetchLatest() {
  return {
    ...model,
    progressPct: Math.min(100, model.progressPct),
  };
}

function renderQuickView(data) {
  const pct = Math.max(0, Math.min(100, Number(data.progressPct || 0)));
  document.querySelector('#kpi-progress-value').textContent = `${pct}%`;
  document.querySelector('#kpi-progress-bar').style.width = `${pct}%`;
  document.querySelector('#kpi-state').textContent = data.globalState;
  document.querySelector('#kpi-next').textContent = data.nextStep;
  document.querySelector('#kpi-alerts').textContent = data.alerts;
  const status = document.querySelector('#short-status');
  status.innerHTML = '';
  for (const line of data.shortStatus) {
    const li = document.createElement('li');
    li.textContent = line;
    status.appendChild(li);
  }
}

function refreshData(mode = 'manuel') {
  const data = fakeFetchLatest();
  renderQuickView(data);
  stampFreshness(mode);
}

function startAutoRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(() => refreshData('auto'), REFRESH_MS);
}

function unlock() {
  gate.hidden = true;
  dashboard.hidden = false;
  refreshData('manuel');
  startAutoRefresh();
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

refreshBtn?.addEventListener('click', () => refreshData('manuel'));
