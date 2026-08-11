'use client';

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle } from 'lucide-react';

export default function RetraitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ media: '', email: '', type: 'retrait', url: '', motif: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Conformité & Droit d'Auteur — Section 28</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Demande de Retrait ou Modification de Contenu</h1>
        <p className="text-xs text-slate-500 mt-1">Éditeurs et créateurs : formulez vos demandes de correction, retrait ou désactivation de l'agrégation.</p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Demande Enregistrée</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">Votre demande concernant {form.media} a été transmise au service juridique. Traitement sous 24h.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Nom de l'Organe de Presse / Média</label>
            <input
              type="text"
              required
              value={form.media}
              onChange={(e) => setForm({ ...form, media: e.target.value })}
              placeholder="Ex: Seneweb, RTS, etc."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium border-0 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Type de demande</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium border-0 focus:ring-2 focus:ring-amber-500"
            >
              <option value="retrait">Retrait d'un article ou vidéo</option>
              <option value="correction">Demande de correction</option>
              <option value="desactivation">Désactivation complète de l'agrégation RSS</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">URL du contenu concerné</label>
            <input
              type="url"
              required
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium border-0 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Motif & Précisions</label>
            <textarea
              required
              rows={4}
              value={form.motif}
              onChange={(e) => setForm({ ...form, motif: e.target.value })}
              placeholder="Expliquez la raison de votre demande..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium border-0 focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/30 transition-all"
          >
            Soumettre la demande
          </button>
        </form>
      )}
    </div>
  );
}
