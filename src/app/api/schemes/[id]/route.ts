import { NextRequest, NextResponse } from 'next/server';
import { getSchemeById } from '@/services/schemeService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const scheme = getSchemeById(id);
    
    if (!scheme) {
      return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
    }
    
    return NextResponse.json(scheme);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
