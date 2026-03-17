const API_BASE = window.LIA_PULSE_API_BASE || '';

async function call(path, { method = 'GET', token, body } = {}) {
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

export async function verifyPin(pin) {
  return call('/api/auth/pin', { method: 'POST', body: { pin } });
}

export async function fetchStatus(token) {
  return call('/api/status', { token });
}

export async function sendDecision(token, decision) {
  return call('/api/blocking/decision', {
    method: 'POST',
    token,
    body: { decision },
  });
}
