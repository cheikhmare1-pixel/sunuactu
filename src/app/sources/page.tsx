'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, Search, PlusCircle, ArrowRight, Filter } from 'lucide-react';
import SourceCard from '@/components/SourceCard';
import { Source } from '@/lib/store';

export default function SourcesPage() {
  const router = useRouter();
  const [sources, setSources] = useState<Source[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [loading, setLoading] = useState(true);
  const [addingCustomUrl, setAddingCustomUrl] = useState(false);

  useEffect(() => {
    fetch('/api/sources')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setSources(data.sources);
      })
      .finally(() => setLoading(false));
  }, []);

  const categoriesList = [
    'Tous',
    'Grands Sites Généralistes',
    'Agences & Médias Institutionnels',
    'Presse Écrite Web',
    'Économie & Business',
    'Régional & Local',
    'Autres Médias Web'
  ];

  const isUrlQuery = (str: string) => {
    const trimmed = str.trim().toLowerCase();
    return (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.includes('.sn') ||
      trimmed.includes('.com') ||
      trimmed.includes('.net') ||
      trimmed.includes('.org') ||
      trimmed.includes('.info')
    );
  };

  const handleAddCustomUrlSource = async (customUrl: string) => {
    setAddingCustomUrl(true);
    let finalUrl = customUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    try {
      const urlObj = new URL(finalUrl);
      const hostName = urlObj.hostname.replace('www.', '');

      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: hostName.toUpperCase(),
          url: finalUrl,
          category: 'Site Personnalisé',
          categories: ['Presse en ligne', 'Site Personnalisé'],
          description: `Site d'information ajouté par URL (${finalUrl}). Consultation en environnement intégré sans quitter SunuActu.`,
          logo: `https://www.google.com/s2/favicons?domain=${hostName}&sz=128`,
          active: true
        })
      });

      const data = await res.json();
      if (data.success && data.source) {
        router.push(`/source/${data.source.id}?view=iframe`);
      }
    } catch (err) {
      console.error(err);
      alert('Veuillez entrer une adresse URL valide (ex: https://lequotidien.sn)');
    } finally {
      setAddingCustomUrl(false);
    }
  };

  const filteredSources = sources.filter((s) => {
    const matchesQuery =
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase()) ||
      s.url.toLowerCase().includes(query.toLowerCase());

    const matchesCat =
      selectedCategory === 'Tous' ||
      s.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesQuery && matchesCat;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
          <Globe className="w-3.5 h-3.5" />
          <span>Répertoire Officiel ({sources.length} Médias Répertoriés) & Webview URL</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Sites d'Information du Sénégal & Consultation par URL
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explorez l'annuaire exhaustif de la presse sénégalaise ou saisissez n'importe quelle URL de site pour le consulter sans quitter SunuActu.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-blue-500 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isUrlQuery(query)) {
                handleAddCustomUrlSource(query);
              }
            }}
            placeholder="Nom d'un média (ex: Seneweb, Sud Quotidien) ou URL (ex: https://lequotidien.sn)..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isUrlQuery(query) && (
          <div className="max-w-2xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-white/20 text-white shrink-0">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <span className="font-bold block text-sm">URL Détectée : {query}</span>
                <span>Ouvrir et lire ce site directement dans l'interface sans quitter SunuActu.</span>
              </div>
            </div>

            <button
              onClick={() => handleAddCustomUrlSource(query)}
              disabled={addingCustomUrl}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 font-extrabold text-xs shadow-md hover:bg-slate-100 transition-colors shrink-0 flex items-center space-x-2"
            >
              <span>{addingCustomUrl ? 'Chargement...' : 'Consulter ce site'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : filteredSources.length === 0 && !isUrlQuery(query) ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Globe className="w-12 h-12 mx-auto text-blue-500 opacity-30" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Aucun média trouvé dans cette catégorie.</h3>
          <p className="text-xs text-slate-500">
            Essayez de sélectionner une autre catégorie ou saisissez l'adresse URL complète du site dans la barre ci-dessus.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSources.map((src) => (
            <SourceCard key={src.id} source={src} />
          ))}
        </div>
      )}
    </div>
  );
}
