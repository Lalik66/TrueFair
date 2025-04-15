'use client';

import React, { useState } from 'react';
import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube';

interface YouTubePlayerProps {
  videoId: string;
  autoplay?: boolean;
  onReady?: (event: YouTubeEvent) => void;
  onEnd?: (event: YouTubeEvent) => void;
  className?: string;
}

export function YouTubePlayer({ 
  videoId, 
  autoplay = false, 
  onReady, 
  onEnd,
  className = '' 
}: YouTubePlayerProps) {
  const [isLoading, setIsLoading] = useState(true);

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: autoplay ? 1 : 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      fs: 1, // Полноэкранный режим
      controls: 1,
    },
  };

  const handleReady = (event: YouTubeEvent) => {
    setIsLoading(false);
    if (onReady) {
      onReady(event);
    }
  };

  const handleEnd = (event: YouTubeEvent) => {
    if (onEnd) {
      onEnd(event);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-gray-900 rounded-lg ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="w-12 h-12 border-4 border-t-indigo-500 border-gray-700 rounded-full animate-spin"></div>
        </div>
      )}
      <div className={`aspect-video ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={handleReady}
          onEnd={handleEnd}
          className="w-full h-full"
        />
      </div>
    </div>
  );
} 