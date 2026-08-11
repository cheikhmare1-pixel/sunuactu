'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Newspaper, Globe, Video, Radio, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'articles' | 'sources' | 'videos' | 'directs'>('all');
  const [results, setResults] = useState<{
    articles: any[];
    sources: any[];
    videos: any[];
    channels: any[];
    lives: any[];
  }>({ articles: [], sources: [], videos: [], channels: [], lives: [] });

  useEffect(() => {
    if (!query.trim()) {
      setResults({ articles: [], sources: [], videos: [], channels: [], lives: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-emerald-500 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un article, vidéo, sujet (ex: Président Sénégal, CAN, Dakar)..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base font-medium"
            autoFocus
          />
          {loading && <Loader2 className="w-5 h-5 text-emerald-500 animate-spin mr-3" />}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center space-x-2 px-6 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 text-xs font-semibold overflow-x-auto">
          {(['all', 'articles', 'sources', 'videos', 'directs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-full capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {tab === 'all' ? 'Tous les résultats' : tab}
            </button>
          ))}
        </div>

        {/* Search Results Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!query.trim() ? (
            <div className="text-center py-12 text-slate-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-500" />
              <p className="text-sm font-medium">Tapez un mot-clé pour lancer la recherche globale instantanée.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                <span className="text-slate-500">Exemples populaires :</span>
                {['Conseil des Ministres', 'Lions du Sénégal', 'TFM Direct', 'Économie 2026', 'Saint-Louis'].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setQuery(ex)}
                    className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-600 dark:text-slate-300 font-semibold transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Articles Section */}
              {(activeTab === 'all' || activeTab === 'articles') && results.articles.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center space-x-1.5">
                    <Newspaper className="w-4 h-4" />
                    <span>Articles ({results.articles.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {results.articles.map((art) => (
                      <div key={art.id} onClick={onClose} className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group cursor-pointer border border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase">{art.sourceName} • {art.category}</span>
                          <h5 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{art.title}</h5>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos Section */}
              {(activeTab === 'all' || activeTab === 'videos') && results.videos.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-3 flex items-center space-x-1.5">
                    <Video className="w-4 h-4" />
                    <span>Vidéos ({results.videos.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {results.videos.map((vid) => (
                      <div key={vid.id} onClick={onClose} className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-3 cursor-pointer border border-slate-100 dark:border-slate-800">
                        <img src={vid.thumbnail} alt={vid.title} className="w-16 h-10 rounded-lg object-cover" />
                        <div>
                          <span className="text-[10px] font-bold text-amber-500 uppercase">{vid.channelName}</span>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{vid.title}</h5>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources Section */}
              {(activeTab === 'all' || activeTab === 'sources') && results.sources.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-3 flex items-center space-x-1.5">
                    <Globe className="w-4 h-4" />
                    <span>Médias d'Information ({results.sources.length})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.sources.map((src) => (
                      <Link key={src.id} href={`/source/${src.id}`} onClick={onClose} className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-3 border border-slate-100 dark:border-slate-800">
                        <img src={src.logo} alt={src.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">{src.name}</h5>
                          <span className="text-[10px] text-slate-500">{src.category}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Directs Section */}
              {(activeTab === 'all' || activeTab === 'directs') && results.lives.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3 flex items-center space-x-1.5">
                    <Radio className="w-4 h-4" />
                    <span>Directs ({results.lives.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {results.lives.map((l) => (
                      <div key={l.id} onClick={onClose} className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between border border-red-500/20">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{l.title}</span>
                        </div>
                        <span className="text-[10px] font-bold text-red-500 uppercase">{l.channelName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
