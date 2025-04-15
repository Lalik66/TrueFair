'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('Произошла ошибка аутентификации');

  useEffect(() => {
    const error = searchParams?.get('error');
    if (error) {
      switch (error) {
        case 'CredentialsSignin':
          setErrorMessage('Неверный email или пароль');
          break;
        case 'SessionRequired':
          setErrorMessage('Вам необходимо войти в систему для доступа к этой странице');
          break;
        case 'AccessDenied':
          setErrorMessage('У вас нет доступа к этой странице');
          break;
        default:
          setErrorMessage(`Произошла ошибка аутентификации: ${error}`);
          break;
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">Ошибка</h2>
          <div className="mt-4 bg-red-900/30 border border-red-800 rounded-md p-6 text-red-400">
            <p className="text-xl font-medium">{errorMessage}</p>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <Link 
              href="/auth/login"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Вернуться на страницу входа
            </Link>
            <Link 
              href="/"
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              На главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 