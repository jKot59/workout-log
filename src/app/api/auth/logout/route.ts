import { NextRequest, NextResponse } from 'next/server';
import { createProxyResponse, getProxyTarget } from '@/lib/authProxy';

export async function POST(req: NextRequest) {
  const target = getProxyTarget('logout');
  const resp = await fetch(target, { method: 'POST', credentials: 'include' });
  return createProxyResponse(resp);
}
