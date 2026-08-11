import { Shield } from 'lucide-react';

export default function ConfidentialitePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Politique de Confidentialité</h1>
        <p className="text-xs text-slate-500 mt-1">Dernière mise à jour : 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-sm space-y-4 text-slate-700 dark:text-slate-300">
        <p>
          Chez <strong>SunuActu</strong>, la protection de vos données personnelles est primordiale. Nous ne collectons aucune information personnelle identifiable sans votre accord préalable.
        </p>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Données collectées</h3>
        <p>
          Nous collectons uniquement des statistiques anonymes de fréquentation (pages vues, types de recherches, appareil utilisé) à des fins d'amélioration de la vitesse et d'optimisation du service.
        </p>
      </div>
    </div>
  );
}
