import { NextResponse } from 'next/server';
import { searchYouTubeVideos } from '@/lib/youtube';
import globalStore from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const category = searchParams.get('category') || undefined;

  if (!q) {
    return NextResponse.json({ success: false, error: 'Paramètre de recherche q requis' }, { status: 400 });
  }

  globalStore.recordSearch();
  const videos = await searchYouTubeVideos(q, category);
  return NextResponse.json({
    success: true,
    query: q,
    count: videos.length,
    videos
  });
}
