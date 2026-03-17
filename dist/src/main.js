import { isPinValid } from './pin.js';

const APP_PIN = '2603';
const REFRESH_MS = 120000;
const THEME_KEY = 'lia-pulse-theme';
let refreshTimer = null;

const model = {
  progressPct: 100,
  globalState: 'En cours — passe 6 active',
  nextStep: 'Validation finale V1 puis clôture.',
  alerts: 'Aucune alerte critique.',
  blockingIssue: {
    active: false,
    title: 'Blocage dur détecté',
    summary: '',
    optionA: { label: 'Option A', pros: '', cons: '', recommendation: '' },
    optionB: { label: 'Option B', pros: '', cons: '', recommendation: '' }
  },
  history: [
    { pass: 'PASS-06', status: 'En cours', note: 'Thème clair/sombre + réglages' },
    { pass: 'PASS-05', status: 'OK', note: 'Onglet Détails + historique' },
    { pass: 'PASS-04', status: 'OK', note: 'Bannière blocage + fiche décision' },
    { pass: 'PASS-03', status: 'OK', note: 'Refresh manuel + auto-refresh' },
    { pass: 'PASS-02', status: 'OK', note: 'Vue Rapide + avancement' }
  ],
  shortStatus: [
    'On en est à peu près à 100 % du développement.',
    'Pas de problème que l’on ne puisse gérer.',
    'Prochaine étape : validation finale et clôture.'
  ]
};

const $ = (s) => document.querySelector(s);
const form = $('#pin-form');
const pinInput = $('#pin-input');
const toggle = $('#toggle-pin');
const error = $('#pin-error');
const gate = $('#gate');
const dashboard = $('#dashboard');
const refreshBtn = $('#refresh-btn');
const freshness = $('#freshness');
const blockBanner = $('#block-banner');
const blockBtn = $('#block-open');
const blockCard = $('#block-card');
const blockClose = $('#block-close');
const tabQuick = $('#tab-quick');
const tabDetails = $('#tab-details');
const tabSettings = $('#tab-settings');
const panelQuick = $('#panel-quick');
const panelDetails = $('#panel-details');
const panelSettings = $('#panel-settings');
const themeSelect = $('#theme-select');

function applyTheme(theme) {
  const chosen = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', chosen);
  localStorage.setItem(THEME_KEY, chosen);
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute('content', chosen === 'light' ? '#f8fafc' : '#0f172a');
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(saved);
  if (themeSelect) themeSelect.value = saved;
}

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
  $('#block-banner-text').textContent = issue.title;
  $('#block-title').textContent = issue.title;
  $('#block-summary').textContent = issue.summary;
  $('#optA-label').textContent = issue.optionA.label;
  $('#optA-pros').textContent = `Pour : ${issue.optionA.pros}`;
  $('#optA-cons').textContent = `Contre : ${issue.optionA.cons}`;
  $('#optA-rec').textContent = `Préconisation : ${issue.optionA.recommendation}`;
  $('#optB-label').textContent = issue.optionB.label;
  $('#optB-pros').textContent = `Pour : ${issue.optionB.pros}`;
  $('#optB-cons').textContent = `Contre : ${issue.optionB.cons}`;
  $('#optB-rec').textContent = `Préconisation : ${issue.optionB.recommendation}`;
}

function renderHistory(items) {
  const list = $('#history-list');
  list.innerHTML = '';
  for (const item of items.slice(0, 5)) {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = `<strong>${item.pass}</strong> — ${item.status}<br><span class="small">${item.note}</span>`;
    list.appendChild(li);
  }
}

function renderQuickView(data) {
  const pct = Math.max(0, Math.min(100, Number(data.progressPct || 0)));
  $('#kpi-progress-value').textContent = `${pct}%`;
  $('#kpi-progress-bar').style.width = `${pct}%`;
  $('#kpi-state').textContent = data.globalState;
  $('#kpi-next').textContent = data.nextStep;
  $('#kpi-alerts').textContent = data.alerts;

  const status = $('#short-status');
  status.innerHTML = '';
  for (const line of data.shortStatus) {
    const li = document.createElement('li');
    li.textContent = line;
    status.appendChild(li);
  }

  renderBlockingIssue(data.blockingIssue);
  renderHistory(data.history);
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

function showTab(which = 'quick') {
  panelQuick.hidden = which !== 'quick';
  panelDetails.hidden = which !== 'details';
  panelSettings.hidden = which !== 'settings';
  tabQuick.classList.toggle('active', which === 'quick');
  tabDetails.classList.toggle('active', which === 'details');
  tabSettings.classList.toggle('active', which === 'settings');
}

function unlock() {
  gate.hidden = true;
  dashboard.hidden = false;
  refreshData('manuel');
  startAutoRefresh();
  showTab('quick');
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
tabQuick?.addEventListener('click', () => showTab('quick'));
tabDetails?.addEventListener('click', () => showTab('details'));
tabSettings?.addEventListener('click', () => showTab('settings'));
themeSelect?.addEventListener('change', (e) => applyTheme(e.target.value));

initTheme();
