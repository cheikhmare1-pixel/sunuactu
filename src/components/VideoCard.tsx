'use client';

import React, { useState } from 'react';
import { Play, Eye, X, ExternalLink, Loader2 } from 'lucide-react';
import { Video } from '@/lib/store';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const currentSrc = img.src;

    if (currentSrc.includes('maxresdefault.jpg')) {
      img.src = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
    } else if (currentSrc.includes('hqdefault.jpg')) {
      img.src = `https://i.ytimg.com/vi/${video.youtubeId}/mqdefault.jpg`;
    } else if (currentSrc.includes('mqdefault.jpg')) {
      img.src = `https://i.ytimg.com/vi/${video.youtubeId}/sddefault.jpg`;
    } else {
      img.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80';
    }
  };

  const embedUrl = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&vq=hd1080`;

  return (
    <>
      <div className="group bg-white dark:bg-slate-800/90 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/70 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
        
        <div
          onClick={() => {
            setIsPlaying(true);
            setIframeLoading(true);
          }}
          className="relative h-48 w-full overflow-hidden bg-slate-950 cursor-pointer"
        >
          <img
            src={video.thumbnail || `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors flex items-center justify-center">
            <div className="w-13 h-13 rounded-full bg-red-600/95 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </div>
          </div>

          {video.duration && (
            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-bold">
              {video.duration}
            </span>
          )}

          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-amber-400 text-[10px] font-bold">
            {video.category}
          </span>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <img src={video.channelLogo} alt={video.channelName} className="w-5 h-5 rounded-full object-cover" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{video.channelName}</span>
            </div>

            <h3
              onClick={() => {
                setIsPlaying(true);
                setIframeLoading(true);
              }}
              className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 cursor-pointer group-hover:text-red-500 transition-colors leading-snug"
            >
              {video.title}
            </h3>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            {video.views && (
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3 text-red-500" />
                <span>{video.views} vues</span>
              </div>
            )}
            <button
              onClick={() => {
                setIsPlaying(true);
                setIframeLoading(true);
              }}
              className="px-3 py-1 rounded-xl bg-red-600 text-white font-bold text-[11px] hover:bg-red-700 transition-colors shadow-sm shadow-red-600/30"
            >
              ▶ Lecteur HD
            </button>
          </div>
        </div>

      </div>

      {isPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
            
            <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center space-x-2 truncate">
                <img src={video.channelLogo} alt={video.channelName} className="w-6 h-6 rounded-full shrink-0" />
                <span className="text-xs font-bold text-white truncate max-w-md">{video.title}</span>
              </div>
              <button
                onClick={() => setIsPlaying(false)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full pb-[56.25%] bg-black">
              {iframeLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-white space-x-2">
                  <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                  <span className="text-xs font-bold">Chargement HD en cours...</span>
                </div>
              )}

              <iframe
                src={embedUrl}
                title={video.title}
                onLoad={() => setIframeLoading(false)}
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>Chaîne officielle : <strong className="text-white">{video.channelName}</strong></span>
              <div className="flex items-center space-x-3">
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 font-bold hover:bg-red-600 hover:text-white transition-colors flex items-center space-x-1.5"
                >
                  <span>Ouvrir sur l'App YouTube</span>
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
