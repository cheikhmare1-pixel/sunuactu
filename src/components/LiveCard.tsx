'use client';

import React, { useState } from 'react';
import { Radio, Users, Play, X, ExternalLink, Loader2, Tv, AlertCircle } from 'lucide-react';
import { LiveItem } from '@/lib/store';

interface LiveCardProps {
  live: LiveItem;
}

export default function LiveCard({ live }: LiveCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  const isLiveNow = live.type === 'direct' || live.status === 'LIVE';
  const directLink = live.directUrl || (live.channelHandle ? `https://www.youtube.com/${live.channelHandle}/live` : `https://www.youtube.com/watch?v=${live.youtubeId}`);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const currentSrc = img.src;

    if (currentSrc.includes('maxresdefault.jpg')) {
      img.src = `https://i.ytimg.com/vi/${live.youtubeId}/hqdefault.jpg`;
    } else if (currentSrc.includes('hqdefault.jpg')) {
      img.src = `https://i.ytimg.com/vi/${live.youtubeId}/mqdefault.jpg`;
    } else if (currentSrc.includes('mqdefault.jpg')) {
      img.src = `https://i.ytimg.com/vi/${live.youtubeId}/sddefault.jpg`;
    } else {
      img.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80';
    }
  };

  const embedUrl = `https://www.youtube.com/embed/${live.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&vq=hd1080`;

  return (
    <>
      <div className={`group bg-white dark:bg-slate-800/90 rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full ${
        isLiveNow ? 'border-red-500/50 dark:border-red-500/40 ring-1 ring-red-500/20' : 'border-slate-200 dark:border-slate-700/70'
      }`}>
        
        {/* Thumbnail & Live Status Badge */}
        <div
          onClick={() => {
            setIsPlaying(true);
            setIframeLoading(true);
          }}
          className="relative h-48 w-full overflow-hidden bg-slate-950 cursor-pointer"
        >
          <img
            src={live.thumbnail || `https://i.ytimg.com/vi/${live.youtubeId}/hqdefault.jpg`}
            alt={live.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/10 transition-colors flex items-center justify-center">
            <div className={`w-13 h-13 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform ${
              isLiveNow ? 'bg-red-600 text-white live-badge-pulse' : 'bg-slate-800/90 text-white'
            }`}>
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </div>
          </div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {live.isSenegalNews && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-wide shadow-md flex items-center space-x-1">
                <span>🇸🇳 SÉNÉGAL INFO</span>
              </span>
            )}

            {isLiveNow ? (
              <span className="px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center space-x-1 shadow-lg live-badge-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span>🔴 EN DIRECT</span>
              </span>
            ) : live.type === 'recent' ? (
              <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-amber-300 font-bold text-[10px] uppercase">
                DERNIER DIRECT
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-blue-300 font-bold text-[10px] uppercase">
                REDIFFUSION
              </span>
            )}
          </div>

          {/* Viewers Badge */}
          {live.viewers && (
            <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold flex items-center space-x-1">
              <Users className="w-3 h-3 text-red-400" />
              <span>{live.viewers}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <img src={live.channelLogo} alt={live.channelName} className="w-5 h-5 rounded-full object-cover" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{live.channelName}</span>
            </div>

            <h3
              onClick={() => {
                setIsPlaying(true);
                setIframeLoading(true);
              }}
              className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 cursor-pointer group-hover:text-red-500 transition-colors leading-snug"
            >
              {live.title}
            </h3>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">{live.date}</span>
            <button
              onClick={() => {
                setIsPlaying(true);
                setIframeLoading(true);
              }}
              className={`px-3 py-1 rounded font-bold text-xs transition-colors ${
                isLiveNow
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/30'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              {isLiveNow ? '▶ Suivre le Direct' : '▶ Voir la vidéo'}
            </button>
          </div>
        </div>

      </div>

      {/* Embedded Live Player Modal */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0"></span>
                <span className="text-xs sm:text-sm font-bold text-white truncate max-w-md">{live.title}</span>
              </div>
              <button
                onClick={() => setIsPlaying(false)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Container */}
            <div className="relative w-full pb-[56.25%] bg-black shrink-0">
              {iframeLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-white space-y-3 p-4 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                  <span className="text-sm font-bold">Chargement du flux en direct HD...</span>
                </div>
              )}

              <iframe
                src={embedUrl}
                title={live.title}
                onLoad={() => setIframeLoading(false)}
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Direct Channel External Link Footer / Backup Controls */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 overflow-y-auto">
              <div className="flex items-center space-x-3">
                <img src={live.channelLogo} alt={live.channelName} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                <div>
                  <div className="text-white font-extrabold text-xs">{live.channelName}</div>
                  <div className="text-[10px] text-slate-400">Diffusion officielle {live.isSenegalNews ? 'Sénégal TV' : 'Live'}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={directLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition-colors flex items-center space-x-2 shadow-lg shadow-red-600/30"
                >
                  <Tv className="w-4 h-4" />
                  <span>Ouvrir le Direct HD sur YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
