// pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useI18n, getLocaleProps } from '../lib/i18n';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const LoginPage = () => {
  const t = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5235/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // SUCESSO! Salvamos o token no localStorage do navegador
        localStorage.setItem('authToken', data.token);
        // Redirecionamos o usuário para o dashboard
        router.push('/dashboard');
      } else {
        // Erro de login (senha errada, usuário não existe)
        setError(t('LoginPage.InvalidCredentials'));
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(t('LoginPage.NetworkError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            {t('LoginPage.Title')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('LoginPage.EmailLabel')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('LoginPage.EmailPlaceholder')}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('LoginPage.PasswordLabel')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="********"
                disabled={isLoading}
              />
            </div>

            {error && <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? t('LoginPage.Loading') : t('LoginPage.ButtonText')}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const getStaticProps = async (context: any) => {
  return {
    props: {
      ...(await getLocaleProps(context, ['Header', 'Footer', 'LoginPage'])),
    },
  };
}

export default LoginPage;