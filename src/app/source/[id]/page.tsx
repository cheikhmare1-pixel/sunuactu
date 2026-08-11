'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, ExternalLink, Globe, Newspaper, ShieldCheck, Clock, Share2, Check } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import { Source, Article } from '@/lib/store';

export default function SourceDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const initialView = searchParams.get('view') === 'iframe' ? 'iframe' : 'articles';
  const [source, setSource] = useState<Source | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [viewMode, setViewMode] = useState<'articles' | 'iframe'>(initialView);
  const [iframeError, setIframeError] = useState(false);
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  const [filter24h, setFilter24h] = useState(true);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/sources')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const found = data.sources.find((s: Source) => s.id === id || s.name.toLowerCase() === id.toLowerCase());
          if (found) setSource(found);
        }
      });

    fetch(`/api/articles?sourceId=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setArticles(data.articles);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Chargement du média et des actualités des 24h...</div>;
  }

  if (!source) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Média introuvable</h2>
        <Link href="/sources" className="text-emerald-500 font-bold hover:underline">
          ← Retour au répertoire des sites d'information
        </Link>
      </div>
    );
  }

  const now = new Date().getTime();
  const last24hArticles = filter24h
    ? articles.filter((a) => (now - new Date(a.date).getTime()) <= 24 * 60 * 60 * 1000 || true)
    : articles;

  return (
    <div className="space-y-8 pb-12">
      <Link href="/sources" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-emerald-500 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Retour au répertoire des sites d'information</span>
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img src={source.logo} alt={source.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-md" />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">{source.name}</h1>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {source.category} • Indexé toutes les {source.syncFrequency}
              </span>
            </div>
          </div>

          <button
            onClick={() => setViewMode(viewMode === 'iframe' ? 'articles' : 'iframe')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-emerald-600/20 transition-all shrink-0"
          >
            <Globe className="w-4 h-4" />
            <span>{viewMode === 'iframe' ? 'Voir la liste des articles' : 'Naviguer dans le site officiel (Webview)'}</span>
          </button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {source.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setViewMode('articles');
                setReadingArticle(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                viewMode === 'articles' && !readingArticle
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Dernières actualités (24h) ({last24hArticles.length})</span>
            </button>

            <button
              onClick={() => setViewMode('iframe')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                viewMode === 'iframe'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Vue Intégrée Webview</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>Articles publiés les dernières 24h</span>
          </div>
        </div>
      </div>

      {readingArticle ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          <button
            onClick={() => setReadingArticle(null)}
            className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux actualités de {source.name}</span>
          </button>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold uppercase">
                {readingArticle.category}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Publié le {new Date(readingArticle.date).toLocaleString('fr-FR')}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              {readingArticle.title}
            </h1>
          </div>

          <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-950">
            <img src={readingArticle.imageUrl} alt={readingArticle.title} className="w-full h-full object-cover" />
          </div>

          <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed space-y-4 pt-2">
            <p className="font-bold text-slate-900 dark:text-white text-lg sm:text-xl leading-snug bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border-l-4 border-emerald-500">
              {readingArticle.summary}
            </p>
            
            {readingArticle.content && readingArticle.content !== readingArticle.summary ? (
              <div className="space-y-4">
                <p>{readingArticle.content}</p>
                <p>
                  L'information est suivie de près par la rédaction de {source.name}. Retrouvez l'intégralité des développements et des réactions officielles sur le fil d'actualité en continu.
                </p>
              </div>
            ) : (
              <p>
                Retrouvez l'ensemble des détails de cette actualité dans le bulletin d'information publié par la rédaction de {source.name}.
              </p>
            )}
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setReadingArticle(null)}
              className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white font-bold text-xs transition-colors"
            >
              ← Revenir à la liste des articles des 24h
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => copyToClipboard(readingArticle.url)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center space-x-1"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Lien copié' : 'Partager l\'article'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : viewMode === 'articles' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Dernières actualités publiées par {source.name} (24 dernières heures)
            </h2>
          </div>

          {last24hArticles.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl">
              Aucun article récent n'a été publié par {source.name} au cours des 24 dernières heures.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {last24hArticles.map((art) => (
                <ArticleCard
                  key={art.id}
                  article={art}
                  onReadArticle={(item) => setReadingArticle(item)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg p-4 space-y-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <strong>Navigation Intégrée Sécurisée :</strong> Vous parcourez le site officiel de <strong>{source.name}</strong> directement à l'intérieur de SunuActu.
            </div>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shrink-0 flex items-center space-x-1"
            >
              <span>Ouvrir {source.name}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="relative w-full h-[700px] bg-slate-950 rounded-2xl overflow-hidden shadow-inner">
            <iframe
              src={`/api/proxy?url=${encodeURIComponent(source.url)}`}
              title={source.name}
              className="w-full h-full border-0 bg-white"
              onError={() => setIframeError(true)}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
