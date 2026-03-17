import { isPinValid } from './pin.js';

const APP_PIN = '2603';
const REFRESH_MS = 120000;
let refreshTimer = null;

const model = {
  progressPct: 66,
  globalState: 'En cours — passe 4 active',
  nextStep: 'Finaliser blocage persistant + fiche décision.',
  alerts: 'Blocage dur détecté : validation UX requise.',
  blockingIssue: {
    active: true,
    title: 'Blocage dur : rendu bannière iPhone à valider',
    summary: 'Le rendu est fonctionnel mais la validation visuelle finale est en attente.',
    optionA: {
      label: 'Option A — garder le style actuel',
      pros: 'Rapide, simple, cohérent avec la base actuelle.',
      cons: 'Moins premium que l’objectif final chat.html-like.',
      recommendation: 'Recommandée pour garder le rythme de livraison.'
    },
    optionB: {
      label: 'Option B — retravailler le style maintenant',
      pros: 'Finition visuelle plus proche de la cible.',
      cons: 'Prend plus de temps sur la V1.',
      recommendation: 'À choisir si priorité absolue à l’esthétique.'
    }
  },
  shortStatus: [
    'On en est à peu près à 66 % du développement.',
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
const blockBanner = document.querySelector('#block-banner');
const blockBtn = document.querySelector('#block-open');
const blockCard = document.querySelector('#block-card');
const blockClose = document.querySelector('#block-close');

function stampFreshness(mode = 'auto') {
  const when = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  freshness.textContent = `Dernière mise à jour: ${when} (${mode})`;
}

function fakeFetchLatest() {
  return { ...model, progressPct: Math.max(0, Math.min(100, model.progressPct)) };
}

function renderBlockingIssue(issue) {
  if (!issue?.active) {
    blockBanner.hidden = true;
    blockCard.hidden = true;
    return;
  }
  blockBanner.hidden = false;
  document.querySelector('#block-banner-text').textContent = issue.title;
  document.querySelector('#block-title').textContent = issue.title;
  document.querySelector('#block-summary').textContent = issue.summary;
  document.querySelector('#optA-label').textContent = issue.optionA.label;
  document.querySelector('#optA-pros').textContent = `Pour : ${issue.optionA.pros}`;
  document.querySelector('#optA-cons').textContent = `Contre : ${issue.optionA.cons}`;
  document.querySelector('#optA-rec').textContent = `Préconisation : ${issue.optionA.recommendation}`;
  document.querySelector('#optB-label').textContent = issue.optionB.label;
  document.querySelector('#optB-pros').textContent = `Pour : ${issue.optionB.pros}`;
  document.querySelector('#optB-cons').textContent = `Contre : ${issue.optionB.cons}`;
  document.querySelector('#optB-rec').textContent = `Préconisation : ${issue.optionB.recommendation}`;
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

  renderBlockingIssue(data.blockingIssue);
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
blockBtn?.addEventListener('click', () => { blockCard.hidden = false; blockCard.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
blockClose?.addEventListener('click', () => { blockCard.hidden = true; });
