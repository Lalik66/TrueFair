'use client';

import React, { useState } from 'react';
import { YouTubePlayer } from './YouTubePlayer';
import { ILesson } from '@/models/Course';
import { YouTubeEvent } from 'react-youtube';

interface LessonPlayerProps {
  lesson: ILesson;
  onComplete?: () => void;
}

export function LessonPlayer({ lesson, onComplete }: LessonPlayerProps) {
  const [isWatched, setIsWatched] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Функция для отслеживания окончания просмотра видео
  const handleVideoEnd = (event: YouTubeEvent) => {
    setIsWatched(true);
    if (onComplete) {
      onComplete();
    }
  };

  // Отслеживание прогресса просмотра
  const handleVideoReady = (event: YouTubeEvent) => {
    // Инициализация таймера для отслеживания прогресса
    const player = event.target;
    const interval = setInterval(() => {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();
      const calculatedProgress = (currentTime / duration) * 100;
      setProgress(calculatedProgress);
      
      // Если просмотрено более 90%, считаем урок завершенным
      if (calculatedProgress > 90 && !isWatched) {
        setIsWatched(true);
        if (onComplete) {
          onComplete();
        }
        clearInterval(interval);
      }
    }, 1000);

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(interval);
  };

  return (
    <div className="bg-surface rounded-lg overflow-hidden shadow-lg">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-primary mb-2">{lesson.title}</h2>
        <p className="text-secondary mb-4">{lesson.description}</p>
      </div>
      
      <YouTubePlayer 
        videoId={lesson.youtubeVideoId} 
        onEnd={handleVideoEnd}
        onReady={handleVideoReady}
        className="w-full"
      />
      
      <div className="p-4">
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {lesson.materials && lesson.materials.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Материалы</h3>
            <ul className="space-y-2">
              {lesson.materials.map((material, index) => (
                <li key={index} className="flex items-center">
                  <a 
                    href={material.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {material.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {isWatched && (
          <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded text-success flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Урок завершен
          </div>
        )}
      </div>
    </div>
  );
} 