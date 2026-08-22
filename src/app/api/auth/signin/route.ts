import { NextRequest, NextResponse } from 'next/server';
import { createProxyResponse, getProxyTarget } from '@/lib/authProxy';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== 'object' ||
    typeof (body as Record<string, unknown>).username !== 'string' ||
    typeof (body as Record<string, unknown>).password !== 'string' ||
    !(body as Record<string, string>).username.trim() ||
    !(body as Record<string, string>).password
  ) {
    return NextResponse.json({ error: 'username and password are required' }, { status: 400 });
  }

  const target = getProxyTarget('signin');
  const resp = await fetch(target, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  return createProxyResponse(resp);
}
