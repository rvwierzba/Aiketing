// =================================================================
// ARQUIVO: client/pages/register.tsx (ATUALIZADO)
// =================================================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useI18n, getLocaleProps } from '../lib/i18n';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../lib/apiConfig';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import Link from 'next/link';

const RegisterPage = () => {
  const t = useI18n();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(t('RegisterPage.Success'));
        setEmail('');
        setPassword('');
      } else {
        const errorMessage = Array.isArray(data.errors) ? data.errors.map((e: any) => e.description).join(' ') : data.message || t('RegisterPage.GenericError');
        setError(errorMessage);
      }
    } catch (err) {
      setError(t('RegisterPage.NetworkError'));
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
        <div className="w-full max-w-md">
          <div className="p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-900">
              {t('RegisterPage.Title')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('RegisterPage.EmailLabel')}</label>
                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                  placeholder={t('RegisterPage.EmailPlaceholder')} disabled={isLoading} />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('RegisterPage.PasswordLabel')}</label>
                <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                  placeholder="********" disabled={isLoading} />
              </div>
              {message && <div className="p-3 text-sm text-green-800 bg-green-100 rounded-md">{message}</div>}
              {error && <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">{error}</div>}
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:opacity-90 disabled:bg-blue-300">
                {isLoading ? t('RegisterPage.Loading') : t('RegisterPage.ButtonText')}
              </button>
            </form>
          </div>
          {/* BOTÃO ADICIONADO AQUI */}
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              {t('RegisterPage.AlreadyHaveAccount') || 'Already have an account? '} 
              <Link href="/login" className="font-medium text-brand-blue hover:underline">
                {t('Header.Login')}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// CORREÇÃO FINAL E DEFINITIVA
export const getStaticProps = getLocaleProps();

export default RegisterPage;