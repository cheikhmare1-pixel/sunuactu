'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Source } from '@/lib/store';

interface SourceCardProps {
  source: Source;
}

export default function SourceCard({ source }: SourceCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/70 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
      <div className="space-y-4">
        
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 p-1 border border-slate-200 dark:border-slate-600 shrink-0">
            <img src={source.logo} alt={source.name} className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
              {source.name}
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full inline-block mt-0.5">
              {source.category}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
          {source.description}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {source.categories.map((c) => (
            <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-medium">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
        <Link
          href={`/source/${source.id}`}
          className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group"
        >
          <span>Consulter le média</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          title={`Visiter le site officiel ${source.name}`}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
