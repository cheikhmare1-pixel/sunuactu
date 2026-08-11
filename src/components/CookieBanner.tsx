'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, Check } from 'lucide-react';

export default function CookieBanner() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('sunuactu_cookie_consent');
    if (!consent) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sunuactu_cookie_consent', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3">
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Respect de votre vie privée</span>
          Nous utilisons des cookies essentiels pour mesurer l'audience et optimiser votre expérience. En poursuivant votre navigation, vous acceptez notre{' '}
          <Link href="/cookies" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">
            politique des cookies
          </Link>.
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 pt-1">
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center space-x-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Accepter</span>
        </button>
      </div>
    </div>
  );
}
