import { Cookie } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Politique relative aux Cookies</h1>
        <p className="text-xs text-slate-500 mt-1">SunuActu — Sénégal Média Hub</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-sm space-y-4 text-slate-700 dark:text-slate-300">
        <p>
          Ce site utilise des cookies de session uniquement pour mémoriser vos préférences d'affichage (mode clair / mode sombre, langue) et mesurer anonymement l'audience.
        </p>
      </div>
    </div>
  );
}
