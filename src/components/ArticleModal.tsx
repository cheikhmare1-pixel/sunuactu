'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Share2, Check, Clock, Globe, ShieldCheck } from 'lucide-react';
import { Article } from '@/lib/store';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(article.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <img src={article.sourceLogo} alt={article.sourceName} className="w-6 h-6 rounded-full object-cover" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{article.sourceName}</span>
              <span className="text-[10px] text-slate-500 block">• Source Vérifiée</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          <div className="flex items-center space-x-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
              {article.category}
            </span>
            <div className="flex items-center space-x-1 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date(article.date).toLocaleString('fr-FR')}</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            {article.title}
          </h2>

          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-950">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Note d'information légale :</span>
              SunuActu respecte les droits d'auteur de l'éditeur <strong className="underline">{article.sourceName}</strong>. Cet extrait est publié à titre d'indexation. Consultez l'article intégral sur le site officiel de l'éditeur ci-dessous.
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-4 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
              {article.summary}
            </p>
            {article.content && article.content !== article.summary && (
              <p>{article.content}</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href={`/source/${article.sourceId}`}
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all scale-100 hover:scale-105"
            >
              <span>Consulter sur {article.sourceName} (Onglet Sites d'information)</span>
              <Globe className="w-4 h-4" />
            </Link>

            <div className="flex items-center space-x-2">
              <button
                onClick={copyToClipboard}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1 text-xs font-semibold"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Lien copié !' : 'Copier'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
