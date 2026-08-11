'use client';

import React from 'react';
import Link from 'next/link';
import { Newspaper, Shield, FileText, Mail, Info, Cookie, Share2, Award, Megaphone } from 'lucide-react';

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm mt-16 pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 via-amber-500 to-red-600 flex items-center justify-center text-white font-black text-lg">
                S
              </div>
              <span className="font-extrabold text-xl text-white">SunuActu</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Toute l'information du Sénégal au même endroit. Le premier portail d'agrégation d'actualités, vidéos et directes des médias sénégalais.
            </p>
            <div className="flex items-center space-x-3 text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-semibold text-emerald-400">Mise à jour en temps réel</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Accueil</Link></li>
              <li><Link href="/articles" className="hover:text-emerald-400 transition-colors">Actualités & Articles</Link></li>
              <li><Link href="/sources" className="hover:text-emerald-400 transition-colors">Sites d'information</Link></li>
              <li><Link href="/videos" className="hover:text-emerald-400 transition-colors">Chaînes & Vidéos YouTube</Link></li>
              <li><Link href="/directs" className="hover:text-emerald-400 transition-colors">Chaînes en Direct 🔴</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Informations & Conformité</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/apropos" className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5"><Info className="w-3.5 h-3.5"/><span>À propos</span></Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5"><Mail className="w-3.5 h-3.5"/><span>Contact</span></Link></li>
              <li><Link href="/confidentialite" className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5"><Shield className="w-3.5 h-3.5"/><span>Politique de confidentialité</span></Link></li>
              <li><Link href="/conditions" className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5"><FileText className="w-3.5 h-3.5"/><span>Conditions d'utilisation</span></Link></li>
              <li><Link href="/cookies" className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5"><Cookie className="w-3.5 h-3.5"/><span>Gestion des Cookies</span></Link></li>
              <li><Link href="/retrait" className="hover:text-amber-400 transition-colors text-amber-400/90 font-medium">Demande de retrait de contenu</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Partenaires & Anonceurs</h4>
            <ul className="space-y-2 text-xs mb-4">
              <li><Link href="/publicite" className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5"><Megaphone className="w-3.5 h-3.5"/><span>Publicité & Partenariats</span></Link></li>
              <li className="text-slate-500">Intégration compatible Google AdSense</li>
            </ul>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <p className="text-[11px] text-slate-300 font-medium mb-1">💡 Note de respect du droit d'auteur :</p>
              <p className="text-[10px] leading-snug text-slate-400">
                SunuActu répertorie et redirige vers les éditeurs et chaînes YouTube d'origine. Les contenus restent la propriété exclusive de leurs auteurs.
              </p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
          <div>
            © {currentYear} <span className="text-slate-300 font-semibold">SunuActu</span>. Tous droits réservés. Plateforme d'agrégation d'information au Sénégal.
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Dakar, Sénégal 🇸🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
