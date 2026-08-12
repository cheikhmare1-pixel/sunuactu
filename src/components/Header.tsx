'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Sun, Moon, Radio, Newspaper, Globe, Video, Menu, X, ShieldAlert, Sparkles, Bookmark, Flame, Mail } from 'lucide-react';
import SearchModal from './SearchModal';

export default function Header() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const navTabs = [
    { label: 'Articles', href: '/articles', icon: Newspaper },
    { label: 'Sites d\'information', href: '/sources', icon: Globe },
    { label: 'Vidéos', href: '/videos', icon: Video },
    { label: 'Directs', href: '/directs', icon: Radio, isLive: true },
    { label: 'Favoris', href: '/favoris', icon: Bookmark },
    { label: 'Contact', href: '/contact', icon: Mail },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
        
        {/* Dynamic Breaking News Alert Bar */}
        <div className="bg-gradient-to-r from-red-700 via-amber-600 to-emerald-700 text-white px-4 py-1 text-[11px] font-extrabold flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2 truncate">
            <span className="px-2 py-0.5 rounded bg-white text-red-700 uppercase font-black tracking-wider text-[9px] animate-pulse">
              🔴 BREAKING NEWS
            </span>
            <span className="truncate">
              Conseil des Ministres : Adoption du projet de loi de finances et mesures d'urgence agricole.
            </span>
          </div>
          <Link href="/articles" className="hidden sm:inline-flex items-center space-x-1 text-white hover:underline shrink-0 font-bold">
            <span>En savoir plus</span>
            <span>→</span>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo + Title */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-amber-500 to-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
                  S
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
                    SunuActu
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                    Sénégal Média Hub
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.href;

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${tab.isLive ? 'text-red-500 animate-pulse' : ''}`} />
                    <span>{tab.label}</span>
                    {tab.isLive && (
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Tools (Search, Dark mode, Admin) */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Rechercher"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Basculer le thème"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-emerald-600 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </Link>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-3 ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
