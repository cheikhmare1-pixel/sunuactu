import { NextResponse } from 'next/server';
import globalStore from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get('active') === 'true';
  const sources = globalStore.getSources(activeOnly);
  return NextResponse.json(
    { success: true, count: sources.length, sources },
    { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.url) {
      return NextResponse.json({ success: false, error: 'Nom et URL requis' }, { status: 400 });
    }
    const newSource = globalStore.addSource({
      name: body.name,
      logo: body.logo || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=200&q=80',
      url: body.url,
      rss: body.rss || '',
      category: body.category || 'Général',
      categories: body.categories || ['Général'],
      active: body.active ?? true,
      syncFrequency: body.syncFrequency || '15 min',
      description: body.description || '',
      color: body.color || '#00853F',
      priority: body.priority || 10
    });
    return NextResponse.json({ success: true, source: newSource });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
