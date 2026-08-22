import apiFetch from '@/lib/apiFetch';

export const userService = {
  async me() {
    const res = await apiFetch('/api/auth/me', { method: 'GET' });
    if (!res.ok) throw new Error('Failed to fetch current user');
    return res.json();
  },
};

export default userService;
