'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import CategoryFilter from '@/components/CategoryFilter';
import ArticleCard from '@/components/ArticleCard';
import ArticleModal from '@/components/ArticleModal';
import VideoCard from '@/components/VideoCard';
import LiveCard from '@/components/LiveCard';
import SourceCard from '@/components/SourceCard';
import AdBanner from '@/components/AdBanner';
import { Newspaper, Video, Radio, Globe, ArrowRight, RefreshCw } from 'lucide-react';
import { Article, Video as VideoType, LiveItem, Source } from '@/lib/store';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [lives, setLives] = useState<LiveItem[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [artRes, vidRes, liveRes, srcRes] = await Promise.all([
        fetch('/api/articles?sync=true').then((r) => r.json()),
        fetch('/api/videos').then((r) => r.json()),
        fetch('/api/lives').then((r) => r.json()),
        fetch('/api/sources?active=true').then((r) => r.json()),
      ]);

      if (artRes.success) setArticles(artRes.articles);
      if (vidRes.success) setVideos(vidRes.videos);
      if (liveRes.success) setLives(liveRes.lives);
      if (srcRes.success) setSources(srcRes.sources);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh 4 tabs content every 1 hour (3,600,000 ms)
    const interval = setInterval(() => {
      fetchData();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // 1. Breaking News: Mis à jour immédiatement dès qu'un article est repris par plusieurs sources (relatedSources > 1)
  const breakingNewsArticle = React.useMemo(() => {
    if (articles.length === 0) return null;

    const multiSourceArticles = articles.filter(
      (a) => a.relatedSources && a.relatedSources.length > 1
    );

    if (multiSourceArticles.length > 0) {
      const sorted = [...multiSourceArticles].sort((a, b) => {
        const countA = a.relatedSources?.length || 0;
        const countB = b.relatedSources?.length || 0;
        if (countB !== countA) return countB - countA;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      return sorted[0];
    }

    return articles.find((a) => a.isFeatured) || articles[0] || null;
  }, [articles]);

  // 5. 3 sites les plus actifs de la journée
  const top3ActiveSources = React.useMemo(() => {
    return [...sources]
      .filter((s) => s.active)
      .sort((a, b) => (a.priority || 99) - (b.priority || 99))
      .slice(0, 3);
  }, [sources]);

  const filteredArticles = selectedCategory === 'Toutes'
    ? articles
    : articles.filter(a => a.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-12 pb-12">
      {/* Top Banner Ad */}
      <AdBanner type="header" />

      {/* Hero Section: Breaking News multi-sources immédiat */}
      <HeroSection
        featuredArticle={breakingNewsArticle}
        onReadArticle={(item) => setSelectedArticle(item)}
      />

      {/* Category Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Filtrer par Thématique</h2>
          <button
            onClick={fetchData}
            className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser le flux</span>
          </button>
        </div>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />
      </div>

      {/* SECTION 1: 3 Nouveaux Articles */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Actualités Récentes (3 Derniers Articles)</h2>
              <p className="text-xs text-slate-500">Les 3 derniers articles agrégés en continu</p>
            </div>
          </div>
          <Link
            href="/articles"
            className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 group"
          >
            <span>Voir tous les articles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Newspaper className="w-10 h-10 mx-auto mb-2 opacity-30 text-emerald-500" />
            <p className="text-sm">Aucun article trouvé pour la catégorie "{selectedCategory}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.slice(0, 3).map((art) => (
              <ArticleCard key={art.id} article={art} onReadArticle={(item) => setSelectedArticle(item)} />
            ))}
          </div>
        )}
      </section>

      {/* In-feed Ad Banner */}
      <AdBanner type="in-feed" />

      {/* SECTION 2: 3 Nouveaux Directs 🔴 */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-600/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 live-badge-pulse">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Chaînes en Direct (3 Nouveaux Directs)</h2>
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] animate-pulse">LIVE</span>
              </div>
              <p className="text-xs text-slate-500">Les 3 diffusions en direct vidéo TV & Radio les plus récentes</p>
            </div>
          </div>
          <Link
            href="/directs"
            className="flex items-center space-x-1 text-xs font-bold text-red-600 dark:text-red-400 hover:underline group"
          >
            <span>Espace Directs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lives.slice(0, 3).map((live) => (
            <LiveCard key={live.id} live={live} />
          ))}
        </div>
      </section>

      {/* SECTION 3: 3 Nouvelles Vidéos */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Dernières Vidéos (3 Nouvelles Vidéos)</h2>
              <p className="text-xs text-slate-500">Les 3 dernières vidéos publiées sur les chaînes sénégalaises</p>
            </div>
          </div>
          <Link
            href="/videos"
            className="flex items-center space-x-1 text-xs font-bold text-amber-500 hover:underline group"
          >
            <span>Voir toutes les vidéos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.slice(0, 3).map((vid) => (
            <VideoCard key={vid.id} video={vid} />
          ))}
        </div>
      </section>

      {/* SECTION 4: 3 Sites les plus actifs de la journée */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Sites d'Information (3 Médias les plus actifs de la journée)</h2>
              <p className="text-xs text-slate-500">Les 3 journaux et portails de presse les plus actifs aujourd'hui</p>
            </div>
          </div>
          <Link
            href="/sources"
            className="flex items-center space-x-1 text-xs font-bold text-blue-500 hover:underline group"
          >
            <span>Tous les médias</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {top3ActiveSources.map((src) => (
            <SourceCard key={src.id} source={src} />
          ))}
        </div>
      </section>

      {/* Internal Reader Modal */}
      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  );
}
