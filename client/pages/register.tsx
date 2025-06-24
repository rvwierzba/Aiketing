// pages/register.tsx
import { useState } from 'react';
import { useI18n, getLocaleProps } from '../lib/i18n';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const RegisterPage = () => {
  const t = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados para feedback ao usuário
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:5235/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Sucesso
        setMessage(t('RegisterPage.Success'));
        setEmail('');
        setPassword('');
      } else {
        // Erro vindo da API
        const errorData = await response.json();
        const errorMessage = errorData.errors ? errorData.errors.join(', ') : t('RegisterPage.GenericError');
        setError(errorMessage);
      }
    } catch (err) {
      // Erro de rede ou de conexão
      console.error('Fetch error:', err);
      setError(t('RegisterPage.NetworkError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            {t('RegisterPage.Title')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('RegisterPage.EmailLabel')}
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
                placeholder={t('RegisterPage.EmailPlaceholder')}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('RegisterPage.PasswordLabel')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="********"
                disabled={isLoading}
              />
            </div>

            {/* Exibição de mensagens de erro ou sucesso */}
            {message && <p className="text-sm text-green-600">{message}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? t('RegisterPage.Loading') : t('RegisterPage.ButtonText')}
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
      ...(await getLocaleProps(context, ['Header', 'Footer', 'RegisterPage'])),
    },
  };
}

export default RegisterPage;