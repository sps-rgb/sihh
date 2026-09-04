import { NextRequest, NextResponse } from 'next/server';
import { matchSchemesAsync } from '@/services/matchingEngine';
import { UserProfile } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profile = body as UserProfile;
    
    if (!profile) {
      return NextResponse.json({ error: 'User profile is required' }, { status: 400 });
    }
    
    const matches = await matchSchemesAsync(profile);
    
    return NextResponse.json({ matches });
  } catch (error: any) {
    console.error('[api/match-schemes] error:', error);

    const payload = process.env.NODE_ENV === 'production'
      ? { error: 'Failed to match schemes' }
      : { error: error?.message || String(error), stack: error?.stack };

    return NextResponse.json(payload, { status: 500 });
  }
}
