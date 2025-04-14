import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero секция */}
      <section className="flex flex-col items-center justify-center min-h-screen p-6 md:p-12 bg-gradient-to-b from-black to-gray-900 text-white text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            TrueMap
          </span>
        </h1>
        <p className="text-xl md:text-2xl font-light text-gray-300 mb-8 max-w-2xl">
          Образовательная платформа для изучения новых навыков в современном формате
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link href="/courses" className="px-8 py-3 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity">
            Все курсы
          </Link>
          <Link href="/auth/login" className="px-8 py-3 rounded-md bg-transparent border border-white/20 text-white font-medium hover:bg-white/10 transition-colors">
            Войти
          </Link>
        </div>
      </section>

      {/* Особенности платформы */}
      <section className="py-20 px-6 md:px-12 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Особенности платформы</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Доступ по промокоду</h3>
              <p className="text-gray-400">Получите доступ к курсам, используя специальные промокоды.</p>
            </div>

            <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Избранное</h3>
              <p className="text-gray-400">Сохраняйте курсы в избранное для быстрого доступа к ним.</p>
            </div>

            <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Умный поиск</h3>
              <p className="text-gray-400">Используйте фильтры и категории для поиска нужных курсов.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 