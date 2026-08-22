import { NextRequest, NextResponse } from 'next/server';
import { createProxyResponse, getProxyTarget } from '@/lib/authProxy';

export async function POST(req: NextRequest) {
  const target = getProxyTarget('refresh');

  const resp = await fetch(target, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Cookie: req.headers.get('cookie') ?? '',
    },
  });

  return createProxyResponse(resp);
}
