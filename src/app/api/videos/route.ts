import { NextResponse } from 'next/server';
import globalStore from '@/lib/store';
import { searchYouTubeVideos } from '@/lib/youtube';

export const revalidate = 3600; // Auto-revalidate every 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || undefined;
  const category = searchParams.get('category') || undefined;
  const channelId = searchParams.get('channelId') || undefined;

  const searchQueryToUse = query || 'Sénégal actualités journal télévisé';
  const apiResults = await searchYouTubeVideos(searchQueryToUse, category);
  
  const storeVideos = globalStore.getVideos(category, channelId);
  const combined = [...apiResults];

  for (const sv of storeVideos) {
    if (!combined.some((v) => v.youtubeId === sv.youtubeId || v.id === sv.id)) {
      combined.push(sv);
    }
  }

  return NextResponse.json(
    { success: true, count: combined.length, videos: combined },
    { headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600' } }
  );
}
