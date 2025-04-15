'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Мой профиль</h1>
          
          <div className="border-b border-gray-700 pb-6 mb-6">
            <h2 className="text-xl font-medium text-white mb-4">Персональная информация</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Имя</p>
                <p className="text-white">{session.user?.name?.split(' ')[0]}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Фамилия</p>
                <p className="text-white">{session.user?.name?.split(' ')[1]}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="text-white">{session.user?.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Роль</p>
                <p className="text-white">{session.user?.role || 'Пользователь'}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-medium text-white mb-4">Мои курсы</h2>
            <div className="bg-gray-700/30 rounded-lg p-8 text-center">
              <p className="text-gray-400">У вас пока нет активных курсов</p>
              <a
                href="/courses"
                className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Найти курсы
              </a>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => router.push('/auth/logout')}
              className="px-4 py-2 bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/30 transition-colors"
            >
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 