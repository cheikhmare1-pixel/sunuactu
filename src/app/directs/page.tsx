'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Radio, Users, RefreshCw, Search, Loader2, Sparkles, Tv, ShieldCheck } from 'lucide-react';
import LiveCard from '@/components/LiveCard';
import AdBanner from '@/components/AdBanner';
import { LiveItem } from '@/lib/store';

export default function DirectsPage() {
  const [lives, setLives] = useState<LiveItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'direct' | 'recent' | 'rediffusion'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLives = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/lives', window.location.origin);
      url.searchParams.append('type', filterType);
      if (searchQuery.trim()) url.searchParams.append('q', searchQuery.trim());

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) setLives(data.lives);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLives();

    // Auto-refresh lives streams every 1 hour
    const interval = setInterval(() => {
      fetchLives();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [filterType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLives();
  };

  const filteredLives = searchQuery.trim()
    ? lives.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : lives;

  // Separate Senegal news channels vs other live streams
  const senegalNewsLives = filteredLives.filter((l) => l.isSenegalNews || /senegal|rts|tfm|walf|2stv|sentv|itv|7tv|dtv|dakar/i.test(l.channelName + ' ' + l.title));
  const otherLives = filteredLives.filter((l) => !senegalNewsLives.some(s => s.id === l.id));

  const tvChannelsStatus = [
    { name: 'RTS 1', query: 'RTS 1', isLive: true },
    { name: 'TFM', query: 'TFM', isLive: true },
    { name: 'Walf TV', query: 'Walf TV', isLive: true },
    { name: '2STV', query: '2sTV', isLive: true },
    { name: 'Sen TV', query: 'Sen TV', isLive: true },
    { name: 'iTV', query: 'iTV', isLive: true },
    { name: '7TV', query: '7TV', isLive: true },
    { name: 'DTV', query: 'DTV', isLive: true },
    { name: 'SeneNews', query: 'SeneNews', isLive: true },
    { name: 'Seneweb TV', query: 'Seneweb', isLive: true },
    { name: 'Dakaractu', query: 'Dakaractu', isLive: true },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Back Navigation Button & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-red-600 hover:text-white transition-all shadow-sm mb-3 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>← Retour à l'accueil</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Radio className="w-8 h-8 text-red-600 animate-pulse" />
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Chaînes Télévisions du Sénégal En Direct
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Suivez en direct vidéo HD les télévisions et chaînes d'information sénégalaises (RTS 1, TFM, 2sTV, Walf TV, SenTV, iTV, 7TV, SeneNews, Seneweb).
          </p>
        </div>

        <button
          onClick={fetchLives}
          className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-red-600 transition-colors flex items-center space-x-2 shrink-0 self-start md:self-auto shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser les flux Live</span>
        </button>
      </div>

      {/* Live TV Channels Ticker Dashboard */}
      <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 text-white shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tv className="w-5 h-5 text-red-500" />
            <span className="text-sm font-extrabold">Accès Rapide — Télévisions d'Info Sénégal (2026)</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Flux vidéo HD direct</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {tvChannelsStatus.map((chan, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(chan.query);
              }}
              className="p-2.5 rounded-2xl border bg-slate-950 border-red-500/40 text-white hover:border-red-500 transition-all flex items-center justify-between text-xs font-bold text-left group"
            >
              <span className="group-hover:text-red-400 transition-colors">{chan.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-wider flex items-center space-x-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span>LIVE</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <AdBanner type="in-feed" />

      {/* Search Engine */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
        <Search className="w-5 h-5 text-red-500 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une chaîne (ex: RTS, TFM, Walf TV, Seneweb) ou une émission..."
          className="w-full pl-12 pr-28 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-28 top-3 text-xs font-bold text-slate-400 hover:text-slate-600 mr-2"
          >
            Effacer
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-2 px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-colors"
        >
          Rechercher
        </button>
      </form>

      {/* Lives Section Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : filteredLives.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Radio className="w-12 h-12 mx-auto text-red-500 opacity-30" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Aucun direct vidéo trouvé pour cette recherche.</h3>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Section Prioritaire 1 : Chaînes d'Information du Sénégal En Direct */}
          {senegalNewsLives.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="w-3.5 h-3.5 rounded-full bg-red-600 animate-ping"></span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  🇸🇳 Chaînes d'Information du Sénégal En Direct (RTS 1, TFM, Walf TV...)
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {senegalNewsLives.map((live) => (
                  <LiveCard key={live.id} live={live} />
                ))}
              </div>
            </div>
          )}

          {/* Section 2 : Autres Chaînes d'Information & Directs */}
          {otherLives.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Radio className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  🌍 Autres Chaînes d'Information & Directs Internationaux
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherLives.map((live) => (
                  <LiveCard key={live.id} live={live} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
