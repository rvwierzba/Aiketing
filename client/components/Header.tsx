// components/Header.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useI18n } from '../lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher'; 
import Link from 'next/link'; // Usar o Link do Next.js é uma boa prática

export const Header = () => {
  const t = useI18n();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <header className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 bg-white">
      <Link href="/" className="font-bold text-2xl text-gray-800">
        AIketing
      </Link>
      <div className="flex items-center gap-6 md:gap-8">
        <LanguageSwitcher /> {/* 2. ADICIONE O COMPONENTE AQUI */}
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="/#pricing" className="text-gray-600 hover:text-black font-semibold hidden sm:block">
            {t('Header.Pricing')}
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-black font-semibold">
                {t('Header.Dashboard')}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 text-sm"
              >
                {t('Header.Logout')}
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 text-sm">
              {t('Header.Login')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};