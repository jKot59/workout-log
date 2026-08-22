import { useAuthStore } from '@/stores/auth-store';

type FetchInput = RequestInfo | URL;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function apiFetch(input: FetchInput, init: RequestInit = {}) {
  const store = useAuthStore;
  const token = store.getState().accessToken;

  const headers = new Headers(init.headers ?? undefined);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const merged: RequestInit = {
    ...init,
    headers,
    credentials: 'include',
  };

  const doFetch = async (attempt = 0): Promise<Response> => {
    const res = await fetch(input, merged);
    if (res.status !== 401) return res;

    // try refresh once
    if (attempt >= 1) return res;

    try {
      const refreshRes = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
      if (!refreshRes.ok) {
        store.getState().clear();
        window.location.href = '/';
        return res;
      }
      const json = await refreshRes.json();
      const newToken = json?.accessToken;
      if (newToken) {
        store.getState().setToken(newToken);
        // small delay to ensure token is set
        await sleep(10);
        // retry original request with new token
        const newHeaders = new Headers(merged.headers as HeadersInit);
        newHeaders.set('Authorization', `Bearer ${newToken}`);
        const retried = await fetch(input, { ...merged, headers: newHeaders });
        return retried;
      }
    } catch (e) {
      store.getState().clear();
      window.location.href = '/';
      return res;
    }

    return res;
  };

  return doFetch();
}

export default apiFetch;
