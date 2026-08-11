'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Server, Activity, Plus, Trash2, RefreshCw, CheckCircle, AlertTriangle, Megaphone, Lock, Globe, Video } from 'lucide-react';
import { Source, Channel } from '@/lib/store';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'sources' | 'channels' | 'ads'>('stats');

  const [statsData, setStatsData] = useState<any>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceRss, setNewSourceRss] = useState('');
  const [newSourceCat, setNewSourceCat] = useState('Général');

  const [newChanName, setNewChanName] = useState('');
  const [newChanId, setNewChanId] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [stRes, srcRes, chRes] = await Promise.all([
        fetch('/api/admin/stats').then((r) => r.json()),
        fetch('/api/sources').then((r) => r.json()),
        fetch('/api/channels').then((r) => r.json()),
      ]);

      if (stRes.success) setStatsData(stRes);
      if (srcRes.success) setSources(srcRes.sources);
      if (chRes.success) setChannels(chRes.channels);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        alert('Mot de passe administrateur incorrect');
      }
    } catch (err) {
      alert('Erreur lors de la vérification du mot de passe');
    }
  };

  const handleClearCache = async () => {
    const res = await fetch('/api/admin/cache', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      setMsg('Cache réinitialisé !');
      setTimeout(() => setMsg(''), 3000);
      fetchAdminData();
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName || !newSourceUrl) return;
    const res = await fetch('/api/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newSourceName,
        url: newSourceUrl,
        rss: newSourceRss,
        category: newSourceCat
      })
    });
    const data = await res.json();
    if (data.success) {
      setNewSourceName('');
      setNewSourceUrl('');
      setNewSourceRss('');
      fetchAdminData();
    }
  };

  const handleAddChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChanName || !newChanId) return;
    const res = await fetch('/api/channels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newChanName,
        channelId: newChanId
      })
    });
    const data = await res.json();
    if (data.success) {
      setNewChanName('');
      setNewChanId('');
      fetchAdminData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Administration SunuActu</h1>
            <p className="text-xs text-slate-500 mt-1">Espace réservé à l'administrateur de la plateforme</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Mot de passe admin
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Entrez votre mot de passe..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all"
            >
              Se Connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Dashboard Administrateur Sécurisé</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Gestion du Hub SunuActu
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          {msg && <span className="text-xs font-bold text-emerald-500">{msg}</span>}
          <button
            onClick={handleClearCache}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Vider le Cache Serveur</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'stats', label: '📊 Quotas & Statistiques', icon: Activity },
          { id: 'sources', label: '📰 Gestion des Sources Presse', icon: Globe },
          { id: 'channels', label: '📺 Chaînes YouTube', icon: Video },
          { id: 'ads', label: '📢 Espaces Publicitaires', icon: Megaphone },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-bold text-xs transition-all ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'stats' && statsData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Requêtes YouTube API</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{statsData.stats.youtubeRequests}</p>
              <span className="text-[11px] text-emerald-500 font-semibold">Proxy Sécurisé Côté Serveur</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Quota YouTube Estimé</span>
              <p className="text-2xl font-black text-amber-500">{statsData.stats.quotaEstimated} / 10,000</p>
              <span className="text-[11px] text-slate-400">Capacité Quotidienne Protégée</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Taux de Cache Hit</span>
              <p className="text-2xl font-black text-emerald-500">
                {Math.round((statsData.stats.cacheHits / (statsData.stats.cacheHits + statsData.stats.cacheMisses || 1)) * 100)}%
              </p>
              <span className="text-[11px] text-slate-400">{statsData.stats.cacheHits} Hits / {statsData.stats.cacheMisses} Misses</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Recherches Utilisateurs</span>
              <p className="text-2xl font-black text-blue-500">{statsData.stats.searchesCount}</p>
              <span className="text-[11px] text-slate-400">Recherches Média Effectuées</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
