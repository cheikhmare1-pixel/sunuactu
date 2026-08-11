'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, Layers, Bookmark, Share2, Check, X, BookOpen } from 'lucide-react';
import { Article } from '@/lib/store';

interface ArticleCardProps {
  article: Article;
  onReadArticle: (article: Article) => void;
}

export default function ArticleCard({ article, onReadArticle }: ArticleCardProps) {
  const [showSourcesModal, setShowSourcesModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    try {
      const saved = JSON.parse(localStorage.getItem('sunuactu_saved_articles') || '[]');
      if (!isSaved) {
        if (!saved.some((a: any) => a.id === article.id)) saved.push(article);
      } else {
        const filtered = saved.filter((a: any) => a.id !== article.id);
        localStorage.setItem('sunuactu_saved_articles', JSON.stringify(filtered));
        return;
      }
      localStorage.setItem('sunuactu_saved_articles', JSON.stringify(saved));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.origin + `/source/${article.sourceId}`
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.origin + `/source/${article.sourceId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasMultipleSources = article.relatedSources && article.relatedSources.length > 1;

  return (
    <>
      <article className="group bg-white dark:bg-slate-800/90 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/70 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
        
        {/* Article Image */}
        <div
          onClick={() => onReadArticle(article)}
          className="relative h-48 w-full overflow-hidden bg-slate-900 cursor-pointer"
        >
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
          
          {/* Category Tag */}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
            {article.category}
          </span>

          {/* Save / Bookmark Button */}
          <button
            onClick={toggleSave}
            title={isSaved ? 'Retirer des favoris' : 'Sauvegarder dans mes favoris'}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors shadow-md ${
              isSaved ? 'bg-amber-500 text-white' : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>

          {/* Source Logo + Name overlay */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/60">
            <img
              src={article.sourceLogo}
              alt={article.sourceName}
              className="w-4 h-4 rounded-full object-cover"
            />
            <span className="text-xs font-semibold text-white">{article.sourceName}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>{timeAgo(article.date)}</span>
              </div>

              {hasMultipleSources && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSourcesModal(true);
                  }}
                  className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-[10px] hover:bg-blue-500 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <Layers className="w-3 h-3" />
                  <span>Voir {article.relatedSources!.length} sources</span>
                </button>
              )}
            </div>

            <h3
              onClick={() => onReadArticle(article)}
              className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-2 cursor-pointer group-hover:text-emerald-500 transition-colors leading-snug"
            >
              {article.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {article.summary}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
            <button
              onClick={() => onReadArticle(article)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center space-x-1.5 shadow-sm shadow-emerald-600/30"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Lire l'article</span>
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1 text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Lien copié' : 'Partager'}</span>
            </button>
          </div>

        </div>

      </article>

      {showSourcesModal && article.relatedSources && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Déduplication & Couverture Multi-Sources</h3>
                  <span className="text-[10px] text-slate-500 block">{article.relatedSources.length} organes de presse traitent ce sujet</span>
                </div>
              </div>
              <button
                onClick={() => setShowSourcesModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {article.relatedSources.map((src, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <img src={src.sourceLogo} alt={src.sourceName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white block truncate">{src.title}</span>
                      <span className="text-[10px] text-slate-500 block">{src.sourceName} • {timeAgo(src.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center">
              <button
                onClick={() => setShowSourcesModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
