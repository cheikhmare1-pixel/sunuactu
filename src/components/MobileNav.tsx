'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Newspaper, Video, Radio, Bookmark } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const pathname = usePathname();

  const items = [
    { label: 'Accueil', href: '/', icon: Home },
    { label: 'Actu', href: '/articles', icon: Newspaper },
    { label: 'Vidéos', href: '/videos', icon: Video },
    { label: 'Directs', href: '/directs', icon: Radio, isLive: true },
    { label: 'Favoris', href: '/favoris', icon: Bookmark },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-2xl">
      <div className="flex items-center justify-around h-14 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-0.5 transition-colors ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${item.isLive ? 'text-red-500 animate-pulse' : ''}`} />
                {item.isLive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
