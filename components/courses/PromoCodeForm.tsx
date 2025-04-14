'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PromoCodeFormProps {
  courseId: string;
}

export function PromoCodeForm({ courseId }: PromoCodeFormProps) {
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/promocodes/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: promoCode, courseId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Что-то пошло не так');
      }

      setSuccess('Промокод успешно активирован! Перенаправляем на страницу курса...');
      setTimeout(() => {
        router.push(`/courses/${courseId}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при активации промокода');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-primary mb-4">Получить доступ к курсу</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded text-green-400">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="promoCode" className="block text-sm font-medium text-gray-300 mb-1">
            Введите промокод
          </label>
          <input
            type="text"
            id="promoCode"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="w-full p-2.5 bg-gray-900 border border-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Например: COURSE123"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Проверка...' : 'Активировать'}
        </button>
      </form>
    </div>
  );
} 