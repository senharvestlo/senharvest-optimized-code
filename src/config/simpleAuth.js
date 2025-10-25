// Auth locale — sans backend
const HARDCODED = {
  username: 'Senharvest',
  password: 'Xidma@0511',
};

const KEY = 'SH_AUTH';

export function loginLocal(username, password) {
  const ok =
    username === HARDCODED.username &&
    password === HARDCODED.password;
  if (ok) {
    sessionStorage.setItem(KEY, JSON.stringify({ isAdmin: true, at: Date.now() }));
    return true;
  }
  return false;
}

export function logoutLocal() {
  sessionStorage.removeItem(KEY);
}

export function isAdminLocal() {
  try {
    const row = JSON.parse(sessionStorage.getItem(KEY) || '{}');
    return !!row.isAdmin;
  } catch {
    return false;
  }
}
