import { normalizePin } from './pin.js';
import { verifyPin, fetchStatus, sendDecision } from './api.js';

const REFRESH_MS = 120000;
const THEME_KEY = 'lia-pulse-theme';
let refreshTimer = null;
let sessionToken = null;

const defaultModel = {
  progressPct: 0,
  globalState: 'Connexion sécurisée requise',
  nextStep: 'Saisis ton PIN pour ouvrir ta session.',
  alerts: 'Aucune donnée visible sans authentification.',
  blockingIssue: { active: false },
  history: [],
  shortStatus: [
    'On en est à peu près à 0 % du développement.',
    'Pas de donnée accessible sans PIN valide.',
    'Prochaine étape : authentification.'
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
const decisionA = $('#decision-a');
const decisionB = $('#decision-b');
const decisionMsg = $('#decision-msg');
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

function safeModel(input = {}) {
  return {
    ...defaultModel,
    ...input,
    blockingIssue: { active: false, ...(input.blockingIssue || {}) },
    history: Array.isArray(input.history) ? input.history : [],
    shortStatus: Array.isArray(input.shortStatus) ? input.shortStatus : defaultModel.shortStatus,
  };
}

function renderBlockingIssue(issue) {
  if (!issue?.active) {
    blockBanner.hidden = true;
    blockCard.hidden = true;
    return;
  }
  blockBanner.hidden = false;
  $('#block-banner-text').textContent = issue.title || 'Blocage dur détecté';
  $('#block-title').textContent = issue.title || 'Blocage';
  $('#block-summary').textContent = issue.summary || 'Décision requise';
  $('#optA-label').textContent = issue.optionA?.label || 'Option A';
  $('#optA-pros').textContent = `Pour : ${issue.optionA?.pros || '—'}`;
  $('#optA-cons').textContent = `Contre : ${issue.optionA?.cons || '—'}`;
  $('#optA-rec').textContent = `Préconisation : ${issue.optionA?.recommendation || '—'}`;
  $('#optB-label').textContent = issue.optionB?.label || 'Option B';
  $('#optB-pros').textContent = `Pour : ${issue.optionB?.pros || '—'}`;
  $('#optB-cons').textContent = `Contre : ${issue.optionB?.cons || '—'}`;
  $('#optB-rec').textContent = `Préconisation : ${issue.optionB?.recommendation || '—'}`;
}

function renderHistory(items) {
  const list = $('#history-list');
  list.innerHTML = '';
  const last = items.slice(0, 5);
  if (!last.length) {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = '<span class="small">Aucune passe visible pour le moment.</span>';
    list.appendChild(li);
    return;
  }
  for (const item of last) {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = `<strong>${item.pass || 'PASS-??'}</strong> — ${item.status || 'N/A'}<br><span class="small">${item.note || ''}</span>`;
    list.appendChild(li);
  }
}

function renderQuickView(data) {
  const model = safeModel(data);
  const pct = Math.max(0, Math.min(100, Number(model.progressPct || 0)));
  $('#kpi-progress-value').textContent = `${pct}%`;
  $('#kpi-progress-bar').style.width = `${pct}%`;
  $('#kpi-state').textContent = model.globalState;
  $('#kpi-next').textContent = model.nextStep;
  $('#kpi-alerts').textContent = model.alerts;

  const status = $('#short-status');
  status.innerHTML = '';
  for (const line of model.shortStatus) {
    const li = document.createElement('li');
    li.textContent = line;
    status.appendChild(li);
  }

  renderBlockingIssue(model.blockingIssue);
  renderHistory(model.history);
}

async function refreshData(mode = 'manuel') {
  if (!sessionToken) return;
  try {
    const data = await fetchStatus(sessionToken);
    renderQuickView(data);
    stampFreshness(mode);
  } catch (e) {
    $('#kpi-alerts').textContent = 'Impossible de récupérer le statut sécurisé.';
    stampFreshness('erreur');
  }
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

async function handleDecision(decision) {
  if (!sessionToken) return;
  const ok = window.confirm(`Confirmer le déblocage avec ${decision} ?`);
  if (!ok) return;
  decisionMsg.textContent = 'Envoi en cours...';
  try {
    const res = await sendDecision(sessionToken, decision);
    decisionMsg.textContent = res?.message || `Décision ${decision} envoyée.`;
    await refreshData('manuel');
  } catch (e) {
    decisionMsg.textContent = e?.data?.message || 'Échec envoi décision.';
  }
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const pin = normalizePin(pinInput.value);
  if (pin.length < 4) {
    error.textContent = 'PIN trop court.';
    return;
  }

  try {
    const res = await verifyPin(pin);
    sessionToken = res.sessionToken;
    error.textContent = '';
    unlock();
  } catch (e) {
    const remaining = e?.data?.remainingAttempts;
    const blocked = e?.data?.blockedForSec;
    if (blocked) {
      error.textContent = `Trop d'erreurs. Réessaie dans ${Math.ceil(blocked / 60)} min.`;
    } else if (typeof remaining === 'number') {
      error.textContent = `PIN incorrect. Essais restants : ${remaining}.`;
    } else {
      error.textContent = 'Accès impossible. Vérifie la connexion au service sécurisé.';
    }
  }
});

toggle?.addEventListener('change', () => {
  pinInput.type = toggle.checked ? 'text' : 'password';
});

refreshBtn?.addEventListener('click', () => refreshData('manuel'));
blockBtn?.addEventListener('click', () => { blockCard.hidden = false; blockCard.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
blockClose?.addEventListener('click', () => { blockCard.hidden = true; });
decisionA?.addEventListener('click', () => handleDecision('A'));
decisionB?.addEventListener('click', () => handleDecision('B'));
tabQuick?.addEventListener('click', () => showTab('quick'));
tabDetails?.addEventListener('click', () => showTab('details'));
tabSettings?.addEventListener('click', () => showTab('settings'));
themeSelect?.addEventListener('change', (e) => applyTheme(e.target.value));

initTheme();
