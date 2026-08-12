'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Trash2, BookOpen, ExternalLink, Globe, Video } from 'lucide-react';
import { Article } from '@/lib/store';
import ArticleCard from '@/components/ArticleCard';
import ArticleModal from '@/components/ArticleModal';

export default function FavorisPage() {
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sunuactu_saved_articles') || '[]');
      setSavedArticles(saved);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const clearAllFavorites = () => {
    if (confirm('Voulez-vous vraiment effacer tous vos favoris sauvegardés ?')) {
      localStorage.removeItem('sunuactu_saved_articles');
      setSavedArticles([]);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header & Back Button */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-white transition-all shadow-sm mb-3 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>← Retour à l'accueil</span>
          </Link>

          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-3">
            <Bookmark className="w-8 h-8 text-amber-500 fill-amber-500" />
            <span>Mes Favoris & Enregistrements</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Retrouvez tous les articles et reportages sauvegardés pour une lecture ultérieure.
          </p>
        </div>

        {savedArticles.length > 0 && (
          <button
            onClick={clearAllFavorites}
            className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-extrabold text-xs hover:bg-red-600 hover:text-white transition-colors flex items-center space-x-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Vider mes favoris</span>
          </button>
        )}
      </div>

      {/* Favorites List Grid */}
      {savedArticles.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <Bookmark className="w-16 h-16 mx-auto text-amber-500 opacity-30" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Aucun favori enregistré pour l'instant</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Survolez un article ou une vidéo et cliquez sur l'icône marque-page pour le sauvegarder ici.
            </p>
          </div>
          <Link
            href="/articles"
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/30 hover:bg-emerald-700 transition-all"
          >
            <span>Parcourir les actualités</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedArticles.map((art) => (
            <ArticleCard
              key={art.id}
              article={art}
              onReadArticle={(item) => setSelectedArticle(item)}
            />
          ))}
        </div>
      )}

      {/* Bottom Help Banner */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl">
        <div className="text-center sm:text-left space-y-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Besoin d'aide ou une question ?</h4>
          <p className="text-xs text-slate-500">Vous pouvez contacter notre équipe de rédaction et support technique à tout moment.</p>
        </div>
        <Link
          href="/contact"
          className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shrink-0"
        >
          Accéder au Formulaire de Contact →
        </Link>
      </div>

      {/* Reader Modal for Selected Article */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}

    </div>
  );
}
