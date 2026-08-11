import { Megaphone, CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PublicitePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold mb-2">
          <Megaphone className="w-3.5 h-3.5" />
          <span>Section 23 — Publicité & Partenariats</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Annonceurs & Partenaires
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Promouvez votre marque ou vos services auprès d'une audience qualifiée passionnée par l'actualité sénégalaise.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">FORMAT 1</span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Bannière En-tête (Header)</h3>
          <p className="text-xs text-slate-500">Visibilité maximale affichée en haut de chaque page sur desktop et mobile.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-bold text-[10px]">FORMAT 2</span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">In-Feed (Au cœur du flux)</h3>
          <p className="text-xs text-slate-500">Insertion naturelle de vos bannières entre les cartes d'actualités et vidéos.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[10px]">FORMAT 3</span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Partenaire de la Semaine</h3>
          <p className="text-xs text-slate-500">Mise en avant sponsorisée sur la page d'accueil avec badge exclusif.</p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-4 text-center">
        <h3 className="text-xl font-bold">Réserver une campagne</h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Contactez notre régie publicitaire pour obtenir nos tarifs et le kit média complet 2026.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition-all"
        >
          <Mail className="w-4 h-4" />
          <span>Contacter la régie régie</span>
        </Link>
      </div>
    </div>
  );
}
