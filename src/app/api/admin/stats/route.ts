import { NextResponse } from 'next/server';
import globalStore from '@/lib/store';

export async function GET() {
  const stats = globalStore.getStats();
  const sourcesCount = globalStore.getSources().length;
  const activeSourcesCount = globalStore.getSources(true).length;
  const channelsCount = globalStore.getChannels().length;
  const articlesCount = globalStore.getArticles().length;
  const videosCount = globalStore.getVideos().length;
  const livesCount = globalStore.getLives().length;

  return NextResponse.json({
    success: true,
    stats,
    counts: {
      sourcesCount,
      activeSourcesCount,
      channelsCount,
      articlesCount,
      videosCount,
      livesCount
    }
  });
}
