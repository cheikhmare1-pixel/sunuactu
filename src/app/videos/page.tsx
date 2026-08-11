'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Video as VideoIcon, Search, RefreshCw, Tv, ShieldCheck, Film } from 'lucide-react';
import VideoCard from '@/components/VideoCard';
import AdBanner from '@/components/AdBanner';
import { Video, Channel } from '@/lib/store';

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [categoryTab, setCategoryTab] = useState<'all' | 'tv' | 'info_web' | 'production'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchVideos = async (q?: string) => {
    setLoading(true);
    try {
      const queryToUse = q !== undefined ? q : searchQuery;
      const url = new URL('/api/videos', window.location.origin);
      if (queryToUse.trim()) url.searchParams.append('q', queryToUse.trim());
      if (selectedChannel) url.searchParams.append('channelId', selectedChannel);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) setVideos(data.videos);

      const chRes = await fetch('/api/channels?active=true');
      const chData = await chRes.json();
      if (chData.success) setChannels(chData.channels);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();

    // Auto-refresh YouTube videos every 1 hour
    const interval = setInterval(() => {
      fetchVideos();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [selectedChannel]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryTab('all');
    fetchVideos(searchQuery);
  };

  const quickSearch = (term: string) => {
    setSearchQuery(term);
    setCategoryTab('all');
    fetchVideos(term);
  };

  const filteredVideos = videos.filter((vid) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        vid.title.toLowerCase().includes(q) ||
        vid.channelName.toLowerCase().includes(q) ||
        (vid.description && vid.description.toLowerCase().includes(q)) ||
        vid.category.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    if (categoryTab === 'all') return true;

    const searchStr = `${vid.channelName} ${vid.category} ${vid.title} ${vid.channelId}`.toLowerCase();

    if (categoryTab === 'tv') {
      return (
        searchStr.includes('rts') ||
        searchStr.includes('tfm') ||
        searchStr.includes('2stv') ||
        searchStr.includes('walf') ||
        searchStr.includes('sentv') ||
        searchStr.includes('itv') ||
        searchStr.includes('7tv') ||
        searchStr.includes('dtv') ||
        searchStr.includes('rewmi') ||
        searchStr.includes('rdv') ||
        searchStr.includes('leral') ||
        searchStr.includes('tv') ||
        searchStr.includes('officiel') ||
        searchStr.includes('télévision')
      );
    }

    if (categoryTab === 'info_web') {
      return (
        searchStr.includes('seneweb') ||
        searchStr.includes('dakaractu') ||
        searchStr.includes('senegal7') ||
        searchStr.includes('kewoulo') ||
        searchStr.includes('sanslimites') ||
        searchStr.includes('info') ||
        searchStr.includes('news') ||
        searchStr.includes('presse') ||
        searchStr.includes('journal') ||
        searchStr.includes('actualité') ||
        searchStr.includes('indépendante')
      );
    }

    if (categoryTab === 'production') {
      return (
        searchStr.includes('marodi') ||
        searchStr.includes('pikini') ||
        searchStr.includes('dakarbuzz') ||
        searchStr.includes('série') ||
        searchStr.includes('film') ||
        searchStr.includes('production') ||
        searchStr.includes('buzz')
      );
    }

    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white transition-all shadow-sm mb-3 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>← Retour à l'accueil</span>
          </Link>

          <div className="flex items-center space-x-2">
            <VideoIcon className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Espace Vidéos & Chaînes Officiellement Conformes
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Vidéos des télévisions et médias numériques (Mise à jour automatique toutes les heures).
          </p>
        </div>

        <button
          onClick={() => fetchVideos(searchQuery)}
          className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-emerald-600 transition-colors flex items-center space-x-2 shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser le flux (1h)</span>
        </button>
      </div>

      <AdBanner type="in-feed" />

      <div className="space-y-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setCategoryTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
              categoryTab === 'all'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Toutes les vidéos
          </button>

          <button
            onClick={() => setCategoryTab('tv')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              categoryTab === 'tv'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-amber-400" />
            <span>📺 Télévisions Conformes</span>
          </button>

          <button
            onClick={() => setCategoryTab('info_web')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              categoryTab === 'info_web'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>📰 Médias d'Information Web</span>
          </button>

          <button
            onClick={() => setCategoryTab('production')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              categoryTab === 'production'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-blue-400" />
            <span>🎬 Production Numérique</span>
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
          <Search className="w-5 h-5 text-red-500 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une vidéo, un sujet politique, du sport ou une émission..."
            className="w-full pl-12 pr-28 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-colors"
          >
            Rechercher
          </button>
        </form>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs text-slate-500">
          <span className="font-bold shrink-0">Recherches populaires :</span>
          {['RTS 1 20h', 'Faram Facce TFM', 'Senegal7', 'Journal Walf TV', 'Séries Marodi'].map((tag) => (
            <button
              key={tag}
              onClick={() => quickSearch(tag)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-red-500 hover:text-white transition-colors shrink-0 font-medium"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <VideoIcon className="w-12 h-12 mx-auto text-red-500 opacity-30" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Aucune vidéo trouvée dans cette catégorie.</h3>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryTab('all');
              fetchVideos('');
            }}
            className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs"
          >
            Réinitialiser la recherche
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((vid) => (
            <VideoCard key={vid.id} video={vid} />
          ))}
        </div>
      )}
    </div>
  );
}
