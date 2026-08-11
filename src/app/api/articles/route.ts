import { NextResponse } from 'next/server';
import globalStore from '@/lib/store';
import { syncAllActiveRssFeeds } from '@/lib/rss';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const sourceId = searchParams.get('sourceId') || undefined;
  const query = searchParams.get('q') || undefined;
  const sync = searchParams.get('sync') === 'true';

  if (sync) {
    await syncAllActiveRssFeeds();
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
        'Cache-Control': 'public, max-age=15, stale-while-revalidate=45'
      }
    }
  );
}
