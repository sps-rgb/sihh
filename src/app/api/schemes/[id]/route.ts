import { NextRequest, NextResponse } from 'next/server';
import { getSchemeById } from '@/services/schemeService';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const scheme = await getSchemeById(id);
    
    if (!scheme) {
      return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
    }
    
    return NextResponse.json(scheme);
  } catch (error) {
    console.error(`Failed to fetch scheme ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
