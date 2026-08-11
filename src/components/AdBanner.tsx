'use client';

import React from 'react';
import { Megaphone } from 'lucide-react';

interface AdBannerProps {
  type?: 'header' | 'in-feed' | 'sidebar' | 'footer';
}

export default function AdBanner({ type = 'in-feed' }: AdBannerProps) {
  if (type === 'header') {
    return (
      <div className="w-full bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-extrabold text-[10px] uppercase">
            Sponsorisé
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Espace Publicitaire Annonceur Premium — Bénéficiez d'une visibilité maximale sur SunuActu
          </span>
        </div>
        <a href="/publicite" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline hidden sm:inline">
          En savoir plus →
        </a>
      </div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 text-center space-y-3">
        <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[10px] uppercase">
          Publicité
        </span>
        <div className="py-8 bg-slate-200/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <Megaphone className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Emplacement AdSense / Régie</p>
          <p className="text-[10px] text-slate-500 mt-1">300x250 Banner Slot</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
        <Megaphone className="w-4 h-4 text-emerald-500" />
        <span className="font-medium">Emplacement publicitaire au cœur de l'actualité</span>
      </div>
      <a href="/publicite" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
        Réserver cet espace
      </a>
    </div>
  );
}
