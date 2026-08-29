import { NextRequest, NextResponse } from 'next/server';
import { getAllSchemes } from '@/services/schemeService';

export async function GET(request: NextRequest) {
  try {
    const schemes = getAllSchemes();
    return NextResponse.json({ schemes });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schemes' }, { status: 500 });
  }
}
