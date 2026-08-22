import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi, beforeEach } from 'vitest';
import { POST } from './route';

describe('POST /api/auth/signin', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BASE_API_URL = 'http://localhost:3000';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.NEXT_PUBLIC_BASE_API_URL;
  });

  it('forwards valid username and password JSON to the backend', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ accessToken: 'token' }), { status: 200 }));
    const request = new NextRequest('http://localhost:3001/api/auth/signin', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'jane', password: 'secret' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/auth/signin',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'jane', password: 'secret' }),
        credentials: 'include',
      })
    );
  });

  it('rejects malformed JSON without calling the backend', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const request = new NextRequest('http://localhost:3001/api/auth/signin', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{',
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects missing credentials without calling the backend', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const request = new NextRequest('http://localhost:3001/api/auth/signin', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'jane' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
