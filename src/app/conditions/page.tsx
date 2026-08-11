import { FileText } from 'lucide-react';

export default function ConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Conditions Générales d'Utilisation</h1>
        <p className="text-xs text-slate-500 mt-1">Plateforme Média d'Agrégation SunuActu</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-sm space-y-4 text-slate-700 dark:text-slate-300">
        <p>
          L'utilisation du site SunuActu implique l'acceptation pleine et entière des conditions d'utilisation ci-après décrites.
        </p>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Propriété Intellectuelle</h3>
        <p>
          Tous les articles, marques, logos et visuels restent la propriété exclusive de leurs éditeurs de presse respectifs. SunuActu agit en qualité d'indexeur et d'agrégateur d'information.
        </p>
      </div>
    </div>
  );
}
