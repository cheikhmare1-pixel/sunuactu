import { NextResponse } from 'next/server';
import globalStore from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;

  if (!q.trim()) {
    return NextResponse.json({
      success: true,
      query: '',
      results: { articles: [], sources: [], videos: [], channels: [], lives: [] }
    });
  }

  globalStore.recordSearch();
  const queryLower = q.toLowerCase();

  const articles = globalStore.getArticles(category, undefined, q);
  const sources = globalStore.getSources().filter(s => s.name.toLowerCase().includes(queryLower) || s.description.toLowerCase().includes(queryLower));
  const videos = globalStore.getVideos(category, undefined, q);
  const channels = globalStore.getChannels().filter(c => c.name.toLowerCase().includes(queryLower) || c.description.toLowerCase().includes(queryLower));
  const lives = globalStore.getLives().filter(l => l.title.toLowerCase().includes(queryLower) || l.channelName.toLowerCase().includes(queryLower));

  return NextResponse.json({
    success: true,
    query: q,
    results: {
      articles,
      sources,
      videos,
      channels,
      lives
    }
  });
}
