'use client';

import React from 'react';
import { Flame, Clock, Layers, BookOpen } from 'lucide-react';
import { Article } from '@/lib/store';

interface HeroSectionProps {
  featuredArticle: Article | null;
  onReadArticle: (article: Article) => void;
}

export default function HeroSection({ featuredArticle, onReadArticle }: HeroSectionProps) {
  if (!featuredArticle) return null;

  const timeAgo = (dateStr: string) => {
    try {
      const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000);
      if (diff < 60) return `Il y a ${Math.max(1, diff)} min`;
      const hours = Math.floor(diff / 60);
      if (hours < 24) return `Il y a ${hours}h`;
      return `Il y a ${Math.floor(hours / 24)}j`;
    } catch {
      return 'Récemment';
    }
  };

  const sourcesCount = featuredArticle.relatedSources ? featuredArticle.relatedSources.length : 4;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl">
      <div className="absolute inset-0 z-0">
        <img
          src={featuredArticle.imageUrl}
          alt={featuredArticle.title}
          className="w-full h-full object-cover opacity-35 scale-105 filter blur-xs"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
      </div>

      <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6 max-w-4xl">
        
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-lg shadow-red-600/30 animate-pulse">
            <Flame className="w-4 h-4 fill-white" />
            <span>🔥 À LA UNE DE SUNUACTU</span>
          </span>

          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-xs border border-blue-500/30 flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Couvert par {sourcesCount} médias d'information</span>
          </span>

          <span className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 text-xs font-semibold flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{timeAgo(featuredArticle.date)}</span>
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
            {featuredArticle.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed max-w-3xl">
            {featuredArticle.summary}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/60">
            <img
              src={featuredArticle.sourceLogo}
              alt={featuredArticle.sourceName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="text-xs">
              <span className="font-bold text-white block">{featuredArticle.sourceName}</span>
              <span className="text-[10px] text-slate-400">Éditeur Principal • Média Certifié</span>
            </div>
          </div>

          <button
            onClick={() => onReadArticle(featuredArticle)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>Lire la sélection "À la une"</span>
          </button>
        </div>

      </div>
    </section>
  );
}
