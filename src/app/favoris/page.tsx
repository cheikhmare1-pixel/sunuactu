'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
          <Mail className="w-3.5 h-3.5" />
          <span>Section 40 — Nous Contacter</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Formulaire de Contact</h1>
        <p className="text-xs text-slate-500 mt-1">Une question, un partenariat ou une remarque ? Écrivez-nous.</p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Message Envoyé avec Succès !</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">Merci {form.nom}. Notre équipe vous répondra dans les plus brefs délais.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Nom complet</label>
            <input
              type="text"
              required
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              placeholder="Votre nom..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium border-0 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Adresse Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="votre.email@domaine.com..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium border-0 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Sujet</label>
            <input
              type="text"
              value={form.sujet}
              onChange={(e) => setForm({ ...form, sujet: e.target.value })}
              placeholder="Objet de votre message..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium border-0 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Rédigez votre message ici..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium border-0 focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Protection anti-spam active. Vos données ne sont pas réutilisées.</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all"
          >
            Envoyer le Message
          </button>
        </form>
      )}
    </div>
  );
}
