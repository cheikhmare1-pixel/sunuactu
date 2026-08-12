import { NextResponse } from 'next/server';
import { fetchLiveStreams } from '@/lib/youtube';
import globalStore from '@/lib/store';

export const revalidate = 3600; // Auto-revalidate every 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as 'all' | 'direct' | 'recent' | 'rediffusion' | undefined;
  const q = searchParams.get('q') || undefined;

  let lives = await fetchLiveStreams();

  if (type && type !== 'all') {
    lives = lives.filter(l => l.type === type);
  }

  if (q) {
    const queryLower = q.toLowerCase();
    lives = lives.filter(l => l.title.toLowerCase().includes(queryLower) || l.channelName.toLowerCase().includes(queryLower));
  }

  // Prioritize Senegal news channels first
  lives.sort((a, b) => {
    const aSen = a.isSenegalNews ? 1 : 0;
    const bSen = b.isSenegalNews ? 1 : 0;
    return bSen - aSen;
  });

  return NextResponse.json(
    { success: true, count: lives.length, lives },
    { headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600' } }
  );
}
