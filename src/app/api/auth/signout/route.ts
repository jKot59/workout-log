import { NextRequest, NextResponse } from 'next/server';
import { createProxyResponse, getProxyTarget } from '@/lib/authProxy';

export async function GET(req: NextRequest) {
  const target = getProxyTarget('signout');
  const resp = await fetch(target, { method: 'GET', headers: req.headers });
  return createProxyResponse(resp);
}
