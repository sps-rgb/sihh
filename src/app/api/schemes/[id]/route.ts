import { NextRequest, NextResponse } from 'next/server';
import { getSchemeById } from '@/services/schemeService';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let schemeId = '';
  try {
    const { id } = await params;
    schemeId = id;
    const scheme = await getSchemeById(id);
    
    if (!scheme) {
      return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
    }
    
    return NextResponse.json(scheme);
  } catch (error) {
    console.error(`Failed to fetch scheme ${schemeId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
