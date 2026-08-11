import sourcesData from '../data/sources.json';
import channelsData from '../data/channels.json';
import mockArticlesData from '../data/mockArticles.json';
import mockVideosData from '../data/mockVideos.json';
import mockLivesData from '../data/mockLives.json';

export interface Source {
  id: string;
  name: string;
  logo: string;
  url: string;
  rss: string;
  category: string;
  categories: string[];
  active: boolean;
  syncFrequency: string;
  description: string;
  color: string;
  priority: number;
}

export interface Channel {
  id: string;
  name: string;
  channelId?: string;
  youtube_channel_id?: string;
  logo: string;
  url?: string;
  youtube_url?: string;
  website_url?: string;
  description: string;
  category: string;
  type?: string;
  region?: string;
  active: boolean;
  is_live?: boolean;
  priority: number;
}

export interface ArticleSourceGroup {
  sourceName: string;
  sourceLogo: string;
  sourceUrl: string;
  articleUrl: string;
  title: string;
  date: string;
}

export interface Article {
  id: string;
  title: string;
  sourceId: string;
  sourceName: string;
  sourceLogo: string;
  sourceUrl: string;
  url: string;
  imageUrl: string;
  date: string;
  category: string;
  author?: string;
  summary: string;
  content?: string;
  isFeatured?: boolean;
  relatedSources?: ArticleSourceGroup[];
}

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  channelId: string;
  channelName: string;
  channelLogo: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string;
  views?: string;
  category: string;
  description?: string;
}

export interface LiveItem {
  id: string;
  youtubeId: string;
  title: string;
  channelId: string;
  channelName: string;
  channelLogo: string;
  thumbnail: string;
  status: 'LIVE' | 'ENDED' | 'REPLAY';
  statusText: string;
  viewers?: string;
  date: string;
  category: string;
  type: 'direct' | 'recent' | 'rediffusion';
}

export interface SystemStats {
  youtubeRequests: number;
  quotaEstimated: number;
  searchesCount: number;
  cacheHits: number;
  cacheMisses: number;
  lastSyncTime: string;
  errorsLog: { timestamp: string; message: string }[];
}

class DataStore {
  private sources: Source[] = sourcesData as Source[];
  private channels: Channel[] = channelsData as Channel[];
  private articles: Article[] = mockArticlesData as Article[];
  private videos: Video[] = mockVideosData as Video[];
  private lives: LiveItem[] = mockLivesData as LiveItem[];

  private cachedGroupedArticles: Article[] | null = null;
  private lastDeduplicationTime = 0;
  private readonly CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL (3600000 ms)

  private stats: SystemStats = {
    youtubeRequests: 42,
    quotaEstimated: 4200,
    searchesCount: 154,
    cacheHits: 840,
    cacheMisses: 45,
    lastSyncTime: new Date().toISOString(),
    errorsLog: []
  };

  getSources(activeOnly = false): Source[] {
    return activeOnly ? this.sources.filter((s) => s.active) : this.sources;
  }

  getSourceById(id: string): Source | undefined {
    return this.sources.find((s) => s.id === id || s.name.toLowerCase() === id.toLowerCase());
  }

  addSource(source: Omit<Source, 'id'>): Source {
    const id = source.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
    const newSource: Source = { ...source, id };
    this.sources.unshift(newSource);
    this.cachedGroupedArticles = null;
    return newSource;
  }

  getChannels(activeOnly = false): Channel[] {
    return activeOnly ? this.channels.filter((c) => c.active) : this.channels;
  }

  addChannel(channel: Omit<Channel, 'id'>): Channel {
    const id = channel.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
    const newChan: Channel = { ...channel, id };
    this.channels.unshift(newChan);
    return newChan;
  }

  getArticles(category?: string, sourceId?: string, query?: string, deduplicate = true): Article[] {
    const isDefaultFetch = (!category || category === 'Tous') && !sourceId && !query && deduplicate;
    const now = Date.now();

    if (isDefaultFetch && this.cachedGroupedArticles && (now - this.lastDeduplicationTime < this.CACHE_TTL_MS)) {
      this.recordCacheHit();
      return this.cachedGroupedArticles;
    }

    let list = [...this.articles];

    if (category && category !== 'Tous') {
      list = list.filter((a) => a.category.toLowerCase() === category.toLowerCase());
    }

    if (sourceId) {
      list = list.filter((a) => a.sourceId === sourceId || a.sourceName.toLowerCase() === sourceId.toLowerCase());
    }

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.sourceName.toLowerCase().includes(q)
      );
    }

    if (!deduplicate) return list;

    const grouped: Article[] = [];
    const usedIds = new Set<string>();

    for (let i = 0; i < list.length; i++) {
      const main = list[i];
      if (usedIds.has(main.id)) continue;

      const related: ArticleSourceGroup[] = [
        {
          sourceName: main.sourceName,
          sourceLogo: main.sourceLogo,
          sourceUrl: main.sourceUrl,
          articleUrl: main.url,
          title: main.title,
          date: main.date
        }
      ];

      usedIds.add(main.id);
      const keywords = main.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);

      for (let j = i + 1; j < list.length; j++) {
        const other = list[j];
        if (usedIds.has(other.id)) continue;

        const otherKeywords = other.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const matchCount = keywords.filter(k => otherKeywords.includes(k)).length;

        if (matchCount >= 2 || (main.category === other.category && matchCount >= 1 && main.sourceId !== other.sourceId)) {
          if (!related.some(r => r.sourceName === other.sourceName)) {
            related.push({
              sourceName: other.sourceName,
              sourceLogo: other.sourceLogo,
              sourceUrl: other.sourceUrl,
              articleUrl: other.url,
              title: other.title,
              date: other.date
            });
            usedIds.add(other.id);
          }
        }
      }

      grouped.push({
        ...main,
        relatedSources: related.length > 1 ? related : undefined
      });
    }

    if (isDefaultFetch) {
      this.cachedGroupedArticles = grouped;
      this.lastDeduplicationTime = now;
      this.recordCacheMiss();
    }

    return grouped;
  }

  addArticles(newArticles: Article[]) {
    const existingUrls = new Set(this.articles.map((a) => a.url));
    const toAdd = newArticles.filter((a) => !existingUrls.has(a.url));
    if (toAdd.length > 0) {
      this.articles = [...toAdd, ...this.articles];
      this.cachedGroupedArticles = null;
    }
  }

  getVideos(category?: string, channelId?: string, query?: string): Video[] {
    let list = [...this.videos];
    if (category && category !== 'Tous') {
      list = list.filter((v) => v.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (channelId) {
      list = list.filter((v) => v.channelId === channelId);
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.channelName.toLowerCase().includes(q) ||
          (v.description && v.description.toLowerCase().includes(q))
      );
    }
    return list;
  }

  getLives(type?: 'direct' | 'recent' | 'rediffusion'): LiveItem[] {
    if (!type) return this.lives;
    return this.lives.filter((l) => l.type === type);
  }

  recordYoutubeRequest(quotaUnits = 100) {
    this.stats.youtubeRequests += 1;
    this.stats.quotaEstimated += quotaUnits;
  }

  recordSearch() {
    this.stats.searchesCount += 1;
  }

  recordCacheHit() {
    this.stats.cacheHits += 1;
  }

  recordCacheMiss() {
    this.stats.cacheMisses += 1;
  }

  clearCache() {
    this.cachedGroupedArticles = null;
    this.lastDeduplicationTime = 0;
    this.stats.cacheHits = 0;
    this.stats.cacheMisses = 0;
    this.stats.lastSyncTime = new Date().toISOString();
  }

  logError(message: string) {
    this.stats.errorsLog.unshift({
      timestamp: new Date().toISOString(),
      message
    });
    if (this.stats.errorsLog.length > 50) this.stats.errorsLog.pop();
  }

  getStats(): SystemStats {
    return { ...this.stats };
  }
}

const globalStore = new DataStore();
export default globalStore;
