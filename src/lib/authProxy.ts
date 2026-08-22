import { NextResponse } from 'next/server';

export const getBackendOrigin = () => (process.env.NEXT_PUBLIC_BASE_API_URL || '').replace(/\/$/, '');

export const createProxyResponse = async (resp: Response) => {
  const text = await resp.text();
  let json: unknown = null;
  try {
    json = JSON.parse(text || 'null');
  } catch (e) {
    json = { raw: text };
  }

  const nextRes = NextResponse.json(json, { status: resp.status });
  const setCookie = resp.headers.get('set-cookie');
  if (setCookie) nextRes.headers.set('set-cookie', setCookie);
  return nextRes;
};

export const getProxyTarget = (path: string) => `${getBackendOrigin()}/api/auth/${path}`;
