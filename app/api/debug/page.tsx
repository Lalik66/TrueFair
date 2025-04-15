'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ConnectionResult {
  success: boolean;
  message?: string;
  error?: string;
  connectionState?: string;
  connectionStateCode?: number;
  collections?: string[];
  dbName?: string;
  uri?: string;
  environment?: string;
  hostname?: string;
  mongooseVersion?: string;
  serverInfo?: {
    version: string;
    gitVersion: string;
  };
  [key: string]: any;
}

export default function DebugPage() {
  const [directResult, setDirectResult] = useState<ConnectionResult | null>(null);
  const [mongooseResult, setMongooseResult] = useState<ConnectionResult | null>(null);
  const [isLoading, setIsLoading] = useState<{ direct: boolean; mongoose: boolean }>({
    direct: false,
    mongoose: false
  });

  const testDirectConnection = async () => {
    setIsLoading(prev => ({ ...prev, direct: true }));
    try {
      const response = await fetch('/api/debug/mongodb');
      const data = await response.json();
      setDirectResult(data);
    } catch (error) {
      setDirectResult({
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      });
    } finally {
      setIsLoading(prev => ({ ...prev, direct: false }));
    }
  };

  const testMongooseConnection = async () => {
    setIsLoading(prev => ({ ...prev, mongoose: true }));
    try {
      const response = await fetch('/api/debug/mongoose');
      const data = await response.json();
      setMongooseResult(data);
    } catch (error) {
      setMongooseResult({
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      });
    } finally {
      setIsLoading(prev => ({ ...prev, mongoose: false }));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">MongoDB Диагностика</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Прямое соединение с MongoDB</h2>
          <button
            onClick={testDirectConnection}
            disabled={isLoading.direct}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading.direct ? 'Проверка...' : 'Проверить соединение'}
          </button>

          {directResult && (
            <div className="mt-4">
              <div className={`p-3 rounded ${directResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className="font-semibold">
                  {directResult.success ? '✅ Соединение установлено' : '❌ Ошибка соединения'}
                </p>
                {directResult.message && <p>{directResult.message}</p>}
                {directResult.error && <p className="text-red-600">Ошибка: {directResult.error}</p>}
              </div>

              <div className="mt-4 overflow-auto">
                <pre className="bg-gray-100 p-3 rounded text-sm">
                  {JSON.stringify(directResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Соединение через Mongoose</h2>
          <button
            onClick={testMongooseConnection}
            disabled={isLoading.mongoose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading.mongoose ? 'Проверка...' : 'Проверить соединение'}
          </button>

          {mongooseResult && (
            <div className="mt-4">
              <div className={`p-3 rounded ${mongooseResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className="font-semibold">
                  {mongooseResult.success ? '✅ Соединение установлено' : '❌ Ошибка соединения'}
                </p>
                {mongooseResult.message && <p>{mongooseResult.message}</p>}
                {mongooseResult.error && <p className="text-red-600">Ошибка: {mongooseResult.error}</p>}
              </div>

              <div className="mt-4 overflow-auto">
                <pre className="bg-gray-100 p-3 rounded text-sm">
                  {JSON.stringify(mongooseResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Link href="/" className="text-blue-500 hover:underline">← Вернуться на главную</Link>
      </div>
    </div>
  );
} 