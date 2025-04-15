import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'TrueMap | Образовательная платформа',
  description: 'Современная платформа для изучения новых навыков через видеокурсы',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <AuthProvider>
          <header className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <a href="/" className="text-xl font-bold text-white">
                TrueMap
              </a>
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/courses" className="text-gray-300 hover:text-white transition-colors">
                  Курсы
                </a>
                <a href="/search" className="text-gray-300 hover:text-white transition-colors">
                  Поиск
                </a>
                <a
                  href="/auth/login"
                  className="px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Войти
                </a>
              </nav>
              <button className="md:hidden text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </header>

          {children}

          <footer className="bg-gray-900 py-10 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">TrueMap</h3>
                  <p className="text-gray-400">
                    Образовательная платформа с современным подходом к обучению.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Навигация</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="/" className="text-gray-400 hover:text-white transition-colors">
                        Главная
                      </a>
                    </li>
                    <li>
                      <a href="/courses" className="text-gray-400 hover:text-white transition-colors">
                        Курсы
                      </a>
                    </li>
                    <li>
                      <a href="/search" className="text-gray-400 hover:text-white transition-colors">
                        Поиск
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Аккаунт</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="/auth/login" className="text-gray-400 hover:text-white transition-colors">
                        Вход
                      </a>
                    </li>
                    <li>
                      <a href="/auth/register" className="text-gray-400 hover:text-white transition-colors">
                        Регистрация
                      </a>
                    </li>
                    <li>
                      <a
                        href="/profile"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Мой профиль
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} TrueMap. Все права защищены.</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
} 