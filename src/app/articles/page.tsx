'use client';

import React, { useState, useEffect } from 'react';
import { Newspaper, RefreshCw, Search, Filter } from 'lucide-react';
import CategoryFilter from '@/components/CategoryFilter';
import ArticleCard from '@/components/ArticleCard';
import ArticleModal from '@/components/ArticleModal';
import AdBanner from '@/components/AdBanner';
import { Article, Source } from '@/lib/store';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [selectedSource, setSelectedSource] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const fetchArticles = async (sync = false) => {
    if (sync) setSyncing(true);
    else setLoading(true);
    try {
      const url = new URL('/api/articles', window.location.origin);
      if (selectedCategory && selectedCategory !== 'Toutes') url.searchParams.append('category', selectedCategory);
      if (selectedSource) url.searchParams.append('sourceId', selectedSource);
      if (searchQuery) url.searchParams.append('q', searchQuery);
      if (sync) url.searchParams.append('sync', 'true');

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) setArticles(data.articles);

      const srcRes = await fetch('/api/sources?active=true');
      const srcData = await srcRes.json();
      if (srcData.success) setSources(srcData.sources);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, selectedSource]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Onglet 1 — Actualités & Presse</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Flux d'Actualités du Sénégal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Les 3 derniers articles en direct de chaque média sénégalais configuré.
          </p>
        </div>

        <button
          onClick={() => fetchArticles(true)}
          disabled={syncing}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Synchronisation RSS...' : 'Synchroniser les flux RSS'}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchArticles()}
              placeholder="Rechercher dans les articles..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full sm:w-56 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Toutes les sources de presse</option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Newspaper className="w-12 h-12 mx-auto text-emerald-500 opacity-40" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Aucun article trouvé</h3>
          <p className="text-xs text-slate-500">Essayez de réinitialiser vos filtres ou de cliquer sur "Synchroniser les flux RSS".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <ArticleCard key={art.id} article={art} onReadArticle={(item) => setSelectedArticle(item)} />
          ))}
        </div>
      )}

      <AdBanner type="in-feed" />

      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  );
}
