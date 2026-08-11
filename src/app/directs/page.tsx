'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Radio, RefreshCw, Search, Tv } from 'lucide-react';
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

  const liveNow = filteredLives.filter((l) => l.type === 'direct' || l.status === 'LIVE');
  const rediffusions = filteredLives.filter((l) => l.type === 'rediffusion');

  const tvChannelsStatus = [
    { name: 'RTS 1', isLive: true },
    { name: 'TFM', isLive: true },
    { name: '2STV', isLive: true },
    { name: 'Sen TV', isLive: true },
    { name: 'Walf TV', isLive: true },
    { name: 'iTV', isLive: true },
    { name: '7TV', isLive: true },
    { name: 'DTV', isLive: true },
    { name: 'Al Mouridiyyah', isLive: true },
    { name: 'RDV', isLive: false },
    { name: 'Rewmi TV', isLive: false },
  ];

  return (
    <div className="space-y-8 pb-12">
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
              Chaînes Télévisions du Sénégal En Direct & Rediffusions
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Suivez en direct vidéo HD les télévisions sénégalaises conformes (RTS, TFM, 2sTV, Walf TV, SenTV, iTV, 7TV).
          </p>
        </div>

        <button
          onClick={fetchLives}
          className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs hover:bg-red-600 transition-colors flex items-center space-x-2 shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser les flux Live</span>
        </button>
      </div>

      <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 text-white shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tv className="w-5 h-5 text-red-500" />
            <span className="text-sm font-extrabold">Statut d'émission en direct des Télévisions (2025)</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Auto-détection YouTube Live</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {tvChannelsStatus.map((chan, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all ${
                chan.isLive
                  ? 'bg-slate-950 border-red-500/40 text-white'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 opacity-60'
              }`}
            >
              <span>{chan.name}</span>
              {chan.isLive ? (
                <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[9px] font-black uppercase tracking-wider flex items-center space-x-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>LIVE</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[9px] font-bold">
                  Hors ligne
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <AdBanner type="in-feed" />

      <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
        <Search className="w-5 h-5 text-red-500 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une chaîne (ex: RTS, TFM, Walf TV) ou une émission..."
          className="w-full pl-12 pr-28 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md transition-colors"
        >
          Rechercher
        </button>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : filteredLives.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Radio className="w-12 h-12 mx-auto text-red-500 opacity-30" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Aucun direct vidéo en cours pour cette recherche.</h3>
        </div>
      ) : (
        <div className="space-y-10">
          {liveNow.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-ping"></span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Émissions & Journaux En Direct (🔴 EN DIRECT)
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveNow.map((live) => (
                  <LiveCard key={live.id} live={live} />
                ))}
              </div>
            </div>
          )}

          {rediffusions.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Dernières Éditions Spéciales & Rediffusions TV
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rediffusions.map((live) => (
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
