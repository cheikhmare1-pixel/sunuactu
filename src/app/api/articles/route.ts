import { NextResponse } from 'next/server';
import globalStore from '@/lib/store';
import { syncAllActiveRssFeeds } from '@/lib/rss';

export const revalidate = 1800; // Auto-revalidate every 30 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const sourceId = searchParams.get('sourceId') || undefined;
  const query = searchParams.get('q') || undefined;

  // Auto-sync RSS feeds from live Senegalese media portals
  try {
    await syncAllActiveRssFeeds();
  } catch (err) {
    console.error('Erreur de synchronisation RSS:', err);
  }

  const articles = globalStore.getArticles(category, sourceId, query);
  return NextResponse.json(
    {
      success: true,
      count: articles.length,
      articles
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=1800, stale-while-revalidate=300'
      }
    }
  );
}
