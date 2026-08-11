import Parser from 'rss-parser';
import globalStore, { Article, Source } from './store';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded']
    ]
  }
});

export function extractOriginalImageFromItem(item: any): string {
  if (item.enclosure && item.enclosure.url && typeof item.enclosure.url === 'string') {
    return item.enclosure.url;
  }
  if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
    return item.mediaContent.$.url;
  }
  if (item.mediaThumbnail && item.mediaThumbnail.$ && item.mediaThumbnail.$.url) {
    return item.mediaThumbnail.$.url;
  }
  const htmlContent = item.contentEncoded || item.content || item.description || '';
  const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }

  return 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80';
}

export async function fetchRssFeedForSource(source: Source): Promise<Article[]> {
  try {
    if (!source.rss) return [];
    
    const feed = await parser.parseURL(source.rss);
    
    const articles: Article[] = (feed.items || []).slice(0, 5).map((item, idx) => {
      const imageUrl = extractOriginalImageFromItem(item);

      return {
        id: `${source.id}-${idx}-${Date.now().toString(36)}`,
        title: item.title || 'Actualité du jour',
        sourceId: source.id,
        sourceName: source.name,
        sourceLogo: source.logo,
        sourceUrl: source.url,
        url: item.link || source.url,
        imageUrl,
        date: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        category: source.category || 'Général',
        author: item.creator || (item as any).author || source.name,
        summary: item.contentSnippet || (item as any).summary || item.title || '',
        content: item.contentEncoded || item.content || item.contentSnippet || '',
        isFeatured: idx === 0
      };
    });

    globalStore.recordCacheHit();
    return articles;
  } catch (error: any) {
    globalStore.recordCacheMiss();
    globalStore.logError(`Erreur RSS pour la source ${source.name}: ${error.message || 'Échec de connexion'}`);
    return [];
  }
}

export async function syncAllActiveRssFeeds(): Promise<Article[]> {
  const activeSources = globalStore.getSources(true);
  let allFetched: Article[] = [];

  for (const src of activeSources) {
    if (src.rss) {
      const srcArticles = await fetchRssFeedForSource(src);
      allFetched.push(...srcArticles);
    }
  }

  if (allFetched.length > 0) {
    globalStore.addArticles(allFetched);
  }

  return globalStore.getArticles();
}
