import globalStore, { Video, LiveItem } from './store';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyCkgz8j_7mEiBLLTJANPE0wUgPJfrzKtgY';

const cache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour (60 minutes)

export function getYoutubeThumbnail(videoId: string, snippetThumbnails?: any): string {
  if (snippetThumbnails) {
    if (snippetThumbnails.maxres?.url) return snippetThumbnails.maxres.url;
    if (snippetThumbnails.high?.url) return snippetThumbnails.high.url;
    if (snippetThumbnails.medium?.url) return snippetThumbnails.medium.url;
  }
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export async function searchYouTubeVideos(query: string, category?: string): Promise<Video[]> {
  const q = query.trim().toLowerCase();
  const cacheKey = `search:${q}:${category || 'all'}`;
  const cached = cache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    globalStore.recordCacheHit();
    return cached.data;
  }

  globalStore.recordCacheMiss();

  // Perform quick local Store search first so user gets instant results
  const storeMatches = globalStore.getVideos(category, undefined, q).map(v => ({
    ...v,
    thumbnail: getYoutubeThumbnail(v.youtubeId)
  }));

  try {
    globalStore.recordYoutubeRequest(100);
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.append('key', YOUTUBE_API_KEY);
    searchUrl.searchParams.append('part', 'snippet');
    searchUrl.searchParams.append('q', `${q || 'Sénégal actualités'}`);
    searchUrl.searchParams.append('type', 'video');
    searchUrl.searchParams.append('maxResults', '15');
    searchUrl.searchParams.append('order', 'relevance');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 sec timeout for API call

    const res = await fetch(searchUrl.toString(), { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const apiVideos: Video[] = (data.items || []).map((item: any) => {
        const videoId = item.id?.videoId || item.id;
        return {
          id: videoId,
          youtubeId: videoId,
          title: item.snippet.title,
          channelId: item.snippet.channelId,
          channelName: item.snippet.channelTitle,
          channelLogo: `https://www.google.com/s2/favicons?domain=youtube.com&sz=128`,
          thumbnail: getYoutubeThumbnail(videoId, item.snippet.thumbnails),
          publishedAt: item.snippet.publishedAt,
          duration: 'HD',
          views: 'Officiel',
          category: category || 'Actualité',
          description: item.snippet.description
        };
      });

      if (apiVideos.length > 0) {
        // Merge API results with local store results without duplicates
        const combined = [...apiVideos];
        for (const storeV of storeMatches) {
          if (!combined.some(v => v.youtubeId === storeV.youtubeId)) {
            combined.push(storeV);
          }
        }
        cache.set(cacheKey, { timestamp: Date.now(), data: combined });
        return combined;
      }
    }
  } catch (err: any) {
    globalStore.logError(`Erreur API YouTube: ${err.message}`);
  }

  // Instant Fallback if API timeout or no network
  return storeMatches;
}

export async function fetchLiveStreams(): Promise<LiveItem[]> {
  const cacheKey = 'lives_all';
  const cached = cache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    globalStore.recordCacheHit();
    return cached.data;
  }

  globalStore.recordCacheMiss();
  const defaultLives = globalStore.getLives().map(l => ({
    ...l,
    thumbnail: getYoutubeThumbnail(l.youtubeId)
  }));

  try {
    globalStore.recordYoutubeRequest(100);
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.append('key', YOUTUBE_API_KEY);
    searchUrl.searchParams.append('part', 'snippet');
    searchUrl.searchParams.append('eventType', 'live');
    searchUrl.searchParams.append('type', 'video');
    searchUrl.searchParams.append('q', 'RTS TFM Walf 2sTV Senegal direct');
    searchUrl.searchParams.append('maxResults', '10');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(searchUrl.toString(), { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const apiLives: LiveItem[] = (data.items || []).map((item: any) => {
        const videoId = item.id?.videoId || item.id;
        const title = item.snippet.title || '';
        const chTitle = item.snippet.channelTitle || '';
        const isSenegal = /senegal|rts|tfm|walf|2stv|sentv|itv|7tv|dtv|dakar/i.test(title + ' ' + chTitle);

        return {
          id: videoId,
          youtubeId: videoId,
          title: item.snippet.title,
          channelId: item.snippet.channelId,
          channelName: item.snippet.channelTitle,
          channelLogo: `https://www.google.com/s2/favicons?domain=youtube.com&sz=128`,
          thumbnail: getYoutubeThumbnail(videoId, item.snippet.thumbnails),
          status: 'LIVE' as const,
          statusText: 'En Direct Maintenant',
          viewers: 'En direct',
          date: 'Maintenant',
          category: 'Télévision Info',
          type: 'direct' as const,
          isSenegalNews: isSenegal
        };
      });

      if (apiLives.length > 0) {
        // Merge API lives with defaultLives without duplicate IDs
        const existingIds = new Set(apiLives.map(l => l.youtubeId));
        const filteredDefault = defaultLives.filter(l => !existingIds.has(l.youtubeId));
        const combined = [...apiLives, ...filteredDefault].sort((a, b) => {
          const aSen = a.isSenegalNews ? 1 : 0;
          const bSen = b.isSenegalNews ? 1 : 0;
          return bSen - aSen;
        });

        cache.set(cacheKey, { timestamp: Date.now(), data: combined });
        return combined;
      }
    }
  } catch (err: any) {
    globalStore.logError(`Erreur Live YouTube: ${err.message}`);
  }

  return defaultLives;
}
