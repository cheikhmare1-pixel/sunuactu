'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ShieldCheck, ArrowLeft, MessageSquare, HelpCircle, Building2, Megaphone, FileText } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    departement: 'redaction',
    sujet: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.email || !form.message) return;
    setSubmitted(true);
  };

  const contactCards = [
    {
      icon: Mail,
      title: "Rédaction Centrale",
      desc: "Signalements d'actualités, communiqués de presse et exclusivités.",
      detail: "redaction@sunuactu.sn",
      badge: "Dakar 24h/7j",
      color: "emerald"
    },
    {
      icon: Megaphone,
      title: "Régie Publicitaire & Partenariats",
      desc: "Annonces, bannières AdSense, articles sponsorisés & partenariats médias.",
      detail: "pub@sunuactu.sn",
      badge: "Commercial",
      color: "amber"
    },
    {
      icon: FileText,
      title: "Conformité & Droit d'Auteur",
      desc: "Demandes de retrait de contenu, droits à l'image et propriété intellectuelle.",
      detail: "juridique@sunuactu.sn",
      badge: "Juridique",
      color: "red"
    },
    {
      icon: Building2,
      title: "Bureau & Siège Social",
      desc: "Avenue Léopold Sédar Senghor, Dakar Plateau, Sénégal.",
      detail: "+221 33 889 00 00",
      badge: "Siège Dakar",
      color: "blue"
    }
  ];

  const faqs = [
    {
      q: "Comment proposer un nouveau site d'information ou une chaîne YouTube sénégalaise ?",
      a: "Vous pouvez nous envoyer l'URL du site ou le lien de la chaîne YouTube via le formulaire ci-dessous en sélectionnant le département 'Rédaction & Médias'. Notre équipe technique vérifiera la conformité et l'intégrera au hub SunuActu."
    },
    {
      q: "Comment demander le retrait d'un article ou exercer un droit de réponse ?",
      a: "SunuActu est un agrégateur qui répertorie les contenus des éditeurs officiels. Pour toute demande de retrait direct, visitez la page dédiée 'Demande de retrait de contenu' ou sélectionnez le département 'Conformité & Juridique' ci-contre."
    },
    {
      q: "Quelles sont les solutions publicitaires proposées aux annonceurs ?",
      a: "SunuActu propose des emplacements de bannières HD, des habillages événementiels et des bannières in-feed ciblées pour la diaspora et le public au Sénégal. Écrivez à pub@sunuactu.sn pour recevoir notre kit média."
    }
  ];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header & Back Navigation Button */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white transition-all shadow-sm mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>← Retour à l'accueil</span>
        </Link>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Contact & Support — SunuActu
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Une question, une proposition de partenariat, une suggestion ou une demande d'assistance ? Écrivez à l'équipe SunuActu à Dakar.
            </p>
          </div>
        </div>
      </div>

      {/* Top 4 Contact Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contactCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold text-[10px] uppercase">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{card.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 font-bold text-xs text-emerald-600 dark:text-emerald-400 truncate">
                {card.detail}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Form & Office Info Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Interactive Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              <span>Envoyez un message direct</span>
            </h2>
            <p className="text-xs text-slate-500">Remplissez le formulaire ci-dessous. Notre équipe vous répondra sous 24h.</p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-3 animate-fadeIn">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Message transmis avec succès !</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Merci <strong>{form.nom}</strong>. Votre message concernant <strong>"{form.sujet || 'Demande d\'information'}"</strong> a bien été transmis au département sélectionné.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    placeholder="Ex: Modou Diop"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium border-0 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Adresse Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="ex: m.diop@domaine.sn"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium border-0 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Téléphone (Optionnel)</label>
                  <input
                    type="tel"
                    value={form.telephone}
                    onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                    placeholder="+221 77 000 00 00"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium border-0 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Département concerné</label>
                  <select
                    value={form.departement}
                    onChange={(e) => setForm({ ...form, departement: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium border-0 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  >
                    <option value="redaction">Rédaction & Information</option>
                    <option value="publicite">Publicité & Partenariats</option>
                    <option value="juridique">Demande de Retrait / Juridique</option>
                    <option value="support">Support Technique & Bug</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Objet du message</label>
                <input
                  type="text"
                  value={form.sujet}
                  onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                  placeholder="Ex: Proposer un partenariat d'actualité..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium border-0 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Votre Message *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Rédigez votre message ici..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium border-0 focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400"
                ></textarea>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Protection des données personnelles conformes aux lois du Sénégal.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer le Message à la Rédaction</span>
              </button>

            </form>
          )}
        </div>

        {/* Right Side: Office Address & FAQ Accordion */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Office Address Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-extrabold">Siège & Rédaction SunuActu</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Immeuble SunuActu Média Hub, Avenue Léopold Sédar Senghor<br />
              Dakar-Plateau, Sénégal.
            </p>
            <div className="space-y-2 text-xs pt-2 border-t border-slate-800 text-slate-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5"><Clock className="w-3.5 h-3.5 text-amber-400"/><span>Horaires Rédaction :</span></span>
                <strong className="text-white">24h / 24 & 7j / 7</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5"><Phone className="w-3.5 h-3.5 text-blue-400"/><span>Téléphone direct :</span></span>
                <strong className="text-white">+221 33 889 00 00</strong>
              </div>
            </div>
          </div>

          {/* FAQ Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Foire Aux Questions (FAQ)</h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{faq.q}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <Link href="/retrait" className="text-xs font-bold text-amber-500 hover:underline">
                Accéder au formulaire spécial de retrait de contenu →
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
