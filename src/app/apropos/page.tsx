import { Info, ShieldCheck, Globe } from 'lucide-react';

export default function AproposPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
          <Info className="w-3.5 h-3.5" />
          <span>À Propos de SunuActu</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Le Portail Médias Centralisé du Sénégal
        </h1>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
        <p>
          <strong>SunuActu</strong> est une plateforme numérique indépendante spécialisée dans l'agrégation et la valorisation de l'information sénégalaise. Notre mission est de centraliser l'accès aux actualités, articles de presse, vidéos et diffusions en direct afin d'offrir une expérience de lecture moderne et fluide.
        </p>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Engagements et Respect du Droit d'Auteur</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            SunuActu n'est pas un producteur de contenu mais un agrégateur responsable. Les articles indexés appartiennent exclusivement à leurs éditeurs respectifs. Nous affichons des résumés d'indexation accompagnés de liens directs ("Lire l'article original") dirigent les lecteurs vers le site source.
          </p>
        </div>
      </div>
    </div>
  );
}
