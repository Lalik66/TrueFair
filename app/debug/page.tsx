'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDebugInfo = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/debug/db');
      if (!response.ok) {
        throw new Error(`Ошибка при получении данных: ${response.status}`);
      }
      
      const data = await response.json();
      setDbInfo(data);
    } catch (err: any) {
      console.error('Ошибка при получении отладочной информации:', err);
      setError(err.message || 'Неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Отладочная информация</h1>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Состояние базы данных</h2>
            <button
              onClick={fetchDebugInfo}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Обновить
            </button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-400">Загрузка...</p>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-800 rounded-md p-4 text-red-400">
              {error}
            </div>
          ) : dbInfo ? (
            <div className="space-y-6">
              {/* Информация об окружении */}
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Окружение</h3>
                <div className="bg-gray-700/50 rounded-md p-4 overflow-x-auto">
                  <pre className="text-gray-300">{JSON.stringify(dbInfo.environment, null, 2)}</pre>
                </div>
              </div>
              
              {/* Состояние базы данных */}
              <div>
                <h3 className="text-lg font-medium text-white mb-2">База данных</h3>
                <div className={`rounded-md p-4 overflow-x-auto ${dbInfo.database.isConnected ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'}`}>
                  <p className="mb-2 text-lg font-medium">
                    Статус: <span className={dbInfo.database.isConnected ? 'text-green-400' : 'text-red-400'}>
                      {dbInfo.database.readyStateText}
                    </span>
                  </p>
                  <pre className="text-gray-300">{JSON.stringify(dbInfo.database, null, 2)}</pre>
                </div>
              </div>
              
              {/* Модели */}
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Модели</h3>
                <div className="bg-gray-700/50 rounded-md p-4 overflow-x-auto">
                  <pre className="text-gray-300">{JSON.stringify(dbInfo.models, null, 2)}</pre>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Нет данных</p>
          )}
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Тесты API</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Маршруты аутентификации</h3>
              <div className="flex flex-wrap gap-2">
                <a 
                  href="/api/auth/register" 
                  target="_blank" 
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
                >
                  POST /api/auth/register
                </a>
                <a 
                  href="/api/auth/%5B...nextauth%5D" 
                  target="_blank" 
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
                >
                  GET /api/auth/[...nextauth]
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 