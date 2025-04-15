'use client';

import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    async function logout() {
      try {
        await signOut({ redirect: false });
        router.push('/');
      } catch (error) {
        console.error('Ошибка при выходе из системы:', error);
        setIsLoggingOut(false);
      }
    }

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        {isLoggingOut ? (
          <>
            <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mx-auto"></div>
            <h1 className="text-2xl font-bold mt-6">Выход из системы...</h1>
            <p className="text-gray-400 mt-2">Пожалуйста, подождите</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Произошла ошибка</h1>
            <p className="text-gray-400 mt-2">Не удалось выйти из системы</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Вернуться на главную
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 