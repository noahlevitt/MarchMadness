// Central API base. In Codespaces, /api will be proxied by Nginx to the backend.
// If you later want to override, set VITE_API_BASE in env (optional).
const API_BASE = (import.meta?.env?.VITE_API_BASE || '/api').replace(/\/+$/, '');

const textGet = async (path) => {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}`);
  return res.text();
};

const jsonGet = async (path) => {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}`);
  return res.json();
};

const jsonPost = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}`);
  return res.json();
};

// Send a SQL query to the backend and get raw text
export const queryBackend = async (query) => {
  try {
    return await textGet(`/query?q=${encodeURIComponent(query)}`);
  } catch (err) {
    console.error('Error querying backend:', err);
    return 'Error: Unable to fetch data';
  }
};

// Fetch game data as JSON
export const fetchGames = async () => {
  try {
    return await jsonGet('/games');
  } catch (err) {
    console.error('Error fetching games:', err);
    return [];
  }
};

// Login with email and password (returns raw text)
export const backendLogin = async (email, password) => {
  try {
    return await textGet(`/login?email=${encodeURIComponent(email)}&pass=${encodeURIComponent(password)}`);
  } catch (err) {
    console.error('Error logging in:', err);
    return 'Error: Unable to fetch data';
  }
};

// Sign up with email and password (returns raw text)
export const backendSignUp = async (email, password) => {
  try {
    return await textGet(`/signup?email=${encodeURIComponent(email)}&pass=${encodeURIComponent(password)}`);
  } catch (err) {
    console.error('Error signing up:', err);
    return 'Error: Unable to fetch data';
  }
};

// Change balance for a user (returns raw text)
export const changeBalance = async (email, balance) => {
  try {
    return await textGet(`/balance?email=${encodeURIComponent(email)}&balance=${encodeURIComponent(balance)}`);
  } catch (err) {
    console.error('Error changing balance:', err);
    return 'Error: Unable to fetch data';
  }
};

// Place a bet (POST JSON, returns JSON)
export const placeBet = async (payload) => {
  try {
    return await jsonPost('/placebet', payload);
  } catch (err) {
    console.error('Error placing bet:', err);
    return { error: 'Unable to place bet' };
  }
};

// Fetch teams as JSON
export const fetchTeams = async () => {
  try {
    return await jsonGet('/teams');
  } catch (err) {
    console.error('Error fetching teams:', err);
    return [];
  }
};

// Fetch current balance for the given email
export const fetchBalance = async (email) => {
  const res = await fetch(`${API_BASE}/balance?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error(`Failed to fetch balance: ${res.status}`);
  const { balance } = await res.json();
  return parseFloat(balance);
};
