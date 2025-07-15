// =================================================================
// ARQUIVO: client/pages/login.tsx (CORREÇÃO FINAL)
// =================================================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useI18n, getLocaleProps } from '../lib/i18n';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../lib/apiConfig';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const LoginPage = () => {
  const t = useI18n();
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn === true) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        login(data.token);
      } else {
        setError(t('LoginPage.InvalidCredentials'));
      }
    } catch (err) {
      setError(t('LoginPage.NetworkError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn !== false) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-grow"></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900">{t('LoginPage.Title')}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('LoginPage.EmailLabel')}</label>
              <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue" placeholder={t('LoginPage.EmailPlaceholder')} disabled={isLoading} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('LoginPage.PasswordLabel')}</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue" placeholder="********" disabled={isLoading} />
            </div>
            {error && <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">{error}</div>}
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:opacity-90 disabled:bg-blue-300">
              {isLoading ? t('LoginPage.Loading') : t('LoginPage.ButtonText')}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// CORREÇÃO FINAL E DEFINITIVA
export const getStaticProps = getLocaleProps();

export default LoginPage;
