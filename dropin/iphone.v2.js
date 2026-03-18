const API_KEY = 'lia-pulse-api-base';
const API_FALLBACK = 'https://macmini.tail43de1e.ts.net:8787';

let sessionToken = null;
let lastStatus = null;
let blocageSelected = null;
let blocageResolved = false;
let currentPin = '';
let iphoneThemeDark = true;
let iphonePinVisible = false;
let iphoneRefreshOn = true;

function hhmmNow() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function updateHeaderTimestamp() {
  const el = document.querySelector('.project-name');
  if (!el) return;
  el.textContent = `Mon App PWA ｜ ${hhmmNow()}`;
}

function normalizeBase(input) {
  if (!input) return '';
  return String(input).trim().replace(/\/$/, '');
}

function resolveApiBase() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = normalizeBase(params.get('api'));
  if (fromQuery) {
    localStorage.setItem(API_KEY, fromQuery);
    return fromQuery;
  }
  const fromWindow = normalizeBase(window.LIA_PULSE_API_BASE);
  if (fromWindow) {
    localStorage.setItem(API_KEY, fromWindow);
    return fromWindow;
  }
  const fromStorage = normalizeBase(localStorage.getItem(API_KEY));
  if (fromStorage) return fromStorage;
  return API_FALLBACK;
}

const API_BASE = resolveApiBase();

async function apiCall(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data || {};
}

function ensureLockUI() {
  if (document.getElementById('liaLock')) return;
  const lock = document.createElement('div');
  lock.id = 'liaLock';
  lock.innerHTML = `
    <div class="lia-lock-card">
      <h2>Lia Pulse</h2>
      <p>Accès sécurisé par PIN</p>
      <input id="liaPinInput" type="password" inputmode="numeric" maxlength="6" placeholder="Code PIN" />
      <button id="liaPinSubmit">Déverrouiller</button>
      <div id="liaPinError"></div>
    </div>
  `;
  document.body.appendChild(lock);

  const input = document.getElementById('liaPinInput');
  const submit = document.getElementById('liaPinSubmit');
  const error = document.getElementById('liaPinError');

  async function doUnlock() {
    const pin = String(input.value || '').trim().slice(0, 6);
    if (!pin) {
      error.textContent = 'PIN manquant.';
      return;
    }
    submit.disabled = true;
    error.textContent = 'Vérification...';
    try {
      const r = await apiCall('/api/auth/pin', { method: 'POST', body: { pin } });
      sessionToken = r.sessionToken;
      currentPin = pin;
      lock.remove();
      refreshIphone(true);
      showToast('Connexion sécurisée établie');
    } catch (e) {
      const blocked = e?.data?.blockedForSec;
      const remaining = e?.data?.remainingAttempts;
      if (blocked) {
        error.textContent = `Trop d'erreurs. Réessaie dans ${Math.ceil(blocked / 60)} min.`;
      } else if (typeof remaining === 'number') {
        error.textContent = `PIN incorrect. Essais restants: ${remaining}.`;
      } else {
        error.textContent = 'Accès impossible. Vérifie la connexion.';
      }
    } finally {
      submit.disabled = false;
    }
  }

  submit.addEventListener('click', doUnlock);
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') doUnlock();
  });
}

function switchTab(tab, tabEl) {
  document.querySelectorAll('.iphone-tab').forEach((t) => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
  document.querySelectorAll('.iphone-bottom-bar button').forEach((b) => b.classList.remove('active'));
  const home = document.querySelector('.iphone-bottom-bar button:first-child');
  if (home) home.classList.add('active');
  document.getElementById('tabQuick').style.display = tab === 'quick' ? 'block' : 'none';
  document.getElementById('tabDetails').style.display = tab === 'details' ? 'block' : 'none';
  document.getElementById('tabBlocage').style.display = tab === 'blocage' ? 'block' : 'none';
  document.getElementById('tabReglages').style.display = tab === 'reglages' ? 'block' : 'none';
  if (tab === 'details') renderPasses();
  if (tab === 'blocage') renderBlocage();
}

function switchToReglages(btnEl) {
  document.querySelectorAll('.iphone-tab').forEach((t) => t.classList.remove('active'));
  document.querySelectorAll('.iphone-bottom-bar button').forEach((b) => b.classList.remove('active'));
  btnEl.classList.add('active');
  document.getElementById('tabQuick').style.display = 'none';
  document.getElementById('tabDetails').style.display = 'none';
  document.getElementById('tabBlocage').style.display = 'none';
  document.getElementById('tabReglages').style.display = 'block';
}

function activateBottomBtn(btn) {
  document.querySelectorAll('.iphone-bottom-bar button').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
}

function renderPasses() {
  const container = document.getElementById('passListContainer');
  const history = Array.isArray(lastStatus?.history) ? lastStatus.history : [];
  if (!history.length) {
    container.innerHTML = `<div class="quick-block"><div style="font-size:0.72rem;color:var(--gray300)">Pas d’historique bloc disponible pour l’instant.</div></div>`;
    return;
  }

  // Affichage du plus récent au plus ancien.
  const orderedHistory = [...history].reverse();

  container.innerHTML = orderedHistory.map((p, i) => {
    const bloc = p.bloc || p.pass || `Bloc ${i + 1}`;
    const status = p.status || 'N/A';
    const note = p.note || '';
    const duration = p.duration || '—';
    const bugsBlocking = p.bugsBlocking ?? p.bugs_bloquants ?? '0';
    const bugsMinor = p.bugsMinor ?? p.bugs_mineurs ?? '0';

    return `
      <div class="pass-item" id="pass-${i}">
        <div class="pass-trigger" onclick="togglePass(${i})">
          <div class="pass-head">
            <span class="pass-num">${bloc}</span>
            <span style="display:flex;align-items:center;gap:6px">
              <span class="pass-time">${status}</span>
              <svg class="pass-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </div>
          <div class="pass-desc">${note || 'Détail indisponible'}</div>
        </div>
        <div class="pass-drawer">
          <div class="pass-drawer-inner">
            <div class="pass-detail-row"><span class="pdl">Bloc</span><span class="pdv">${bloc}</span></div>
            <div class="pass-detail-row"><span class="pdl">Statut</span><span class="pdv">${status}</span></div>
            <div class="pass-detail-row"><span class="pdl">Durée</span><span class="pdv">${duration}</span></div>
            <div class="pass-detail-row"><span class="pdl">Bugs bloquants</span><span class="pdv">${bugsBlocking}</span></div>
            <div class="pass-detail-row"><span class="pdl">Bugs mineurs</span><span class="pdv">${bugsMinor}</span></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function togglePass(idx) {
  const el = document.getElementById(`pass-${idx}`);
  const wasOpen = el.classList.contains('open');
  document.querySelectorAll('.pass-item').forEach((p) => p.classList.remove('open'));
  if (!wasOpen) el.classList.add('open');
}

function renderBlocage() {
  const c = document.getElementById('blocageContent');
  const b = lastStatus?.blockingIssue || { active: false };
  const isActive = !!b.active && !blocageResolved;

  if (!isActive) {
    c.innerHTML = `
      <div class="blocage-resolved">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <div style="font-size:0.82rem;color:var(--white);font-weight:600">Aucun blocage actif</div>
        <p>Rien à arbitrer pour le moment.</p>
      </div>`;
    return;
  }

  const summary = b.summary || 'Blocage actif en attente de décision.';
  const optionA = b.optionA || { label: 'Option A', pros: '—', cons: '—', recommendation: '' };
  const optionB = b.optionB || { label: 'Option B', pros: '—', cons: '—', recommendation: '' };
  const seenAt = b.seenAt || 'Maintenant';

  blocageSelected = null;
  c.innerHTML = `
    <div style="padding:10px 12px;border-radius:var(--radius-xs);background:var(--rose-dim);border:1px solid rgba(244,63,94,0.2);margin-bottom:10px;display:flex;align-items:center;gap:8px">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
      <span style="font-size:0.72rem;color:var(--rose);font-weight:600">Blocage actif</span>
      <span style="font-size:0.6rem;color:var(--gray400);margin-left:auto">${seenAt}</span>
    </div>
    <div class="quick-block">
      <h5>Problème</h5>
      <div style="font-size:0.75rem;color:var(--gray200);line-height:1.5">${summary}</div>
    </div>
    <div style="display:flex;gap:6px;margin-bottom:0" id="blocageOptions">
      <div class="blocage-opt" onclick="selectBlocageOption(this,'A')">
        <h5 style="color:var(--cyan);font-size:0.7rem;margin-bottom:4px">Option A</h5>
        <div style="font-size:0.7rem;color:var(--gray200);font-weight:600;margin-bottom:4px">${optionA.label || 'Option A'}</div>
        <div style="font-size:0.62rem;color:var(--emerald)">+ ${optionA.pros || '—'}</div>
        <div style="font-size:0.62rem;color:var(--rose)">- ${optionA.cons || '—'}</div>
        ${optionA.recommendation ? `<div style="font-size:0.62rem;color:var(--accent2);margin-top:2px;font-style:italic">${optionA.recommendation}</div>` : ''}
      </div>
      <div class="blocage-opt" onclick="selectBlocageOption(this,'B')">
        <h5 style="color:var(--amber);font-size:0.7rem;margin-bottom:4px">Option B</h5>
        <div style="font-size:0.7rem;color:var(--gray200);font-weight:600;margin-bottom:4px">${optionB.label || 'Option B'}</div>
        <div style="font-size:0.62rem;color:var(--emerald)">+ ${optionB.pros || '—'}</div>
        <div style="font-size:0.62rem;color:var(--rose)">- ${optionB.cons || '—'}</div>
        ${optionB.recommendation ? `<div style="font-size:0.62rem;color:var(--accent2);margin-top:2px;font-style:italic">${optionB.recommendation}</div>` : ''}
      </div>
    </div>
    <button class="blocage-validate" id="blocageValidateBtn" onclick="validateBlocage()">Valider la décision</button>
    <div style="display:flex;align-items:center;justify-content:center;gap:6px;padding:8px;font-size:0.65rem;color:var(--amber)" id="blocageWaiting">
      <span style="width:5px;height:5px;border-radius:50%;background:var(--amber);animation:pulse-dot 1s infinite"></span>
      Sélectionnez une option
    </div>`;
}

function selectBlocageOption(el, opt) {
  blocageSelected = opt;
  document.querySelectorAll('.blocage-opt').forEach((o) => o.classList.remove('selected-a', 'selected-b'));
  el.classList.add(opt === 'A' ? 'selected-a' : 'selected-b');
  document.getElementById('blocageValidateBtn').classList.add('visible');
  document.getElementById('blocageWaiting').innerHTML = `
    <span style="width:5px;height:5px;border-radius:50%;background:var(--cyan);display:inline-block"></span>
    Option ${opt} sélectionnée — Validez pour confirmer`;
}

async function validateBlocage() {
  if (!blocageSelected || !sessionToken) return;
  const btn = document.getElementById('blocageValidateBtn');
  const waiting = document.getElementById('blocageWaiting');
  if (btn) btn.disabled = true;
  if (waiting) {
    waiting.innerHTML = `
      <span style="width:5px;height:5px;border-radius:50%;background:var(--cyan);animation:pulse-dot 1s infinite"></span>
      Validation en cours...`;
  }
  setBlocageLoading(true);
  try {
    await apiCall('/api/blocking/decision', {
      method: 'POST',
      token: sessionToken,
      body: { decision: blocageSelected },
    });
    blocageResolved = false;
    await refreshIphone(true);
    renderBlocage();
    showToast(`Option ${blocageSelected} validée`);
  } catch (e) {
    showToast(e?.data?.message || 'Échec envoi décision');
  } finally {
    setBlocageLoading(false);
    if (btn) btn.disabled = false;
  }
}

async function refreshIphone(initial = false) {
  if (!sessionToken) return;
  try {
    const s = await apiCall('/api/status', { token: sessionToken });
    lastStatus = s;

    const pct = Number(s.progressPct || 0);
    document.getElementById('iphoneProgress').textContent = String(pct);
    document.getElementById('iphoneBar').style.width = `${Math.max(0, Math.min(100, pct))}%`;
    document.getElementById('iphoneNext').textContent = s.nextStep || '—';
    const alertsEl = document.getElementById('iphoneAlerts');
    const alertText = s.alerts || '—';
    if (String(alertText).trim().toLowerCase() === 'blocage') {
      alertsEl.innerHTML = `<span style="color:var(--rose);font-weight:700">Blocage</span>`;
    } else {
      alertsEl.textContent = alertText;
      alertsEl.style.color = 'var(--emerald)';
      alertsEl.style.fontWeight = '500';
    }

    const state = s.globalState || 'Inconnu';
    document.getElementById('iphoneState').innerHTML = `<span class="tag tag-green" style="font-size:0.75rem">${state}</span>`;

    const hasBlock = !!s?.blockingIssue?.active;
    document.getElementById('iphoneBanner').style.display = hasBlock ? 'flex' : 'none';

    updateHeaderTimestamp();
    if (!initial) showToast('Données rafraîchies');
  } catch (e) {
    showToast(e?.data?.message || 'Erreur de rafraîchissement');
  }
}

function applyThemeUI() {
  const toggle = document.getElementById('iphoneThemeToggle');
  const knob = document.getElementById('iphoneThemeKnob');
  const label = document.getElementById('iphoneThemeLabel');
  const icon = document.getElementById('iphoneThemeIcon');
  document.body.setAttribute('data-theme', iphoneThemeDark ? 'dark' : 'light');

  if (iphoneThemeDark) {
    toggle.style.background = 'var(--accent)';
    knob.style.right = '2px';
    knob.style.left = 'auto';
    label.textContent = 'Sombre';
    icon.innerHTML = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
  } else {
    toggle.style.background = 'var(--gray500)';
    knob.style.right = 'auto';
    knob.style.left = '2px';
    label.textContent = 'Clair';
    icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
  }
}

function toggleIphoneTheme() {
  iphoneThemeDark = !iphoneThemeDark;
  localStorage.setItem('lia-pulse-theme', iphoneThemeDark ? 'dark' : 'light');
  applyThemeUI();
}

function toggleIphonePin() {
  iphonePinVisible = !iphonePinVisible;
  const display = document.getElementById('iphonePinDisplay');
  const btn = document.getElementById('iphonePinBtn');
  display.textContent = iphonePinVisible ? (currentPin || '—') : '••••';
  btn.textContent = iphonePinVisible ? 'Masquer' : 'Afficher';
}

function toggleIphoneRefresh() {
  iphoneRefreshOn = !iphoneRefreshOn;
  const toggle = document.getElementById('iphoneRefreshToggle');
  const knob = document.getElementById('iphoneRefreshKnob');
  const label = document.getElementById('iphoneRefreshLabel');
  if (iphoneRefreshOn) {
    toggle.style.background = 'var(--accent)';
    knob.style.right = '2px';
    knob.style.left = 'auto';
    label.textContent = 'Toutes les 2 min';
  } else {
    toggle.style.background = 'var(--gray500)';
    knob.style.right = 'auto';
    knob.style.left = '2px';
    label.textContent = 'Désactivé';
  }
}

function setBlocageLoading(isLoading) {
  const existing = document.getElementById('blocageLoading');
  if (isLoading) {
    if (existing) return;
    const overlay = document.createElement('div');
    overlay.id = 'blocageLoading';
    overlay.innerHTML = `
      <div class="blocage-loading-card">
        <div class="blocage-loading-spinner" aria-hidden="true"></div>
        <div class="blocage-loading-text">Traitement en cours...</div>
      </div>
    `;
    document.body.appendChild(overlay);
    return;
  }
  if (existing) existing.remove();
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
    <span>${message}</span>
    <span class="toast-close" onclick="this.parentElement.remove()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>
  `;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

setInterval(() => {
  if (!iphoneRefreshOn || !sessionToken) return;
  refreshIphone();
}, 120000);

iphoneThemeDark = localStorage.getItem('lia-pulse-theme') !== 'light';
applyThemeUI();
updateHeaderTimestamp();
renderBlocage();
ensureLockUI();
