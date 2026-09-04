import { NextRequest, NextResponse } from 'next/server';
import { getAllSchemes } from '@/services/schemeService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const schemes = await getAllSchemes();
    return NextResponse.json({ schemes });
  } catch (error) {
    console.error('Failed to fetch schemes:', error);
    return NextResponse.json({ error: 'Failed to fetch schemes' }, { status: 500 });
  }
}
