import { useAuthStore } from '@/stores/auth-store';

const BASE = '/api/auth';

export const authService = {
  async signin(payload: { username: string; password: string }) {
    const res = await fetch(`${BASE}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) throw json || new Error('Login failed');

    const token = json?.accessToken;
    if (token) useAuthStore.getState().setToken(token);
    return json;
  },

  async logout() {
    await fetch(`${BASE}/logout`, { method: 'POST', credentials: 'include' });
    useAuthStore.getState().clear();
  },

  async refresh() {
    const res = await fetch(`${BASE}/refresh`, { method: 'POST', credentials: 'include' });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw json || new Error('Refresh failed');
    const token = json?.accessToken;
    if (token) useAuthStore.getState().setToken(token);
    return json;
  },
};

export default authService;
