import { NextResponse } from 'next/server';
import { fetchLiveStreams } from '@/lib/youtube';
import globalStore from '@/lib/store';

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

  return NextResponse.json({ success: true, count: lives.length, lives });
}
