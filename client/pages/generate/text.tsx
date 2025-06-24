// pages/generate/text.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useI18n, getLocaleProps } from '../../lib/i18n';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

const TextGenerationPage = () => {
  const t = useI18n();
  const router = useRouter();

  // Estados do formulário e da resposta
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Proteção da rota: verifica se o usuário está logado
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedText('');

    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`http://localhost:5235/generate-test?prompt=${encodeURIComponent(prompt)}`, {
        method: 'GET', // Conforme definido no seu backend
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedText(data.generatedText);
      } else {
        // Trata erros, como limite de uso excedido (Status 429)
        setError(data.message || t('TextGeneratorPage.GenericError'));
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(t('TextGeneratorPage.NetworkError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('TextGeneratorPage.Title')}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('TextGeneratorPage.Subtitle')}
          </p>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                    {t('TextGeneratorPage.PromptLabel')}
                  </label>
                  <textarea
                    id="prompt"
                    name="prompt"
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('TextGeneratorPage.PromptPlaceholder')}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                  {isLoading ? t('TextGeneratorPage.Loading') : t('TextGeneratorPage.ButtonText')}
                </button>
              </div>
            </form>
          </div>

          {error && <div className="mt-6 p-4 text-sm text-red-800 bg-red-100 rounded-md">{error}</div>}
          
          {generatedText && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg text-gray-900">{t('TextGeneratorPage.ResultTitle')}</h3>
              <div className="mt-4 p-4 bg-gray-50 rounded text-gray-800 whitespace-pre-wrap font-mono">
                {generatedText}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const getStaticProps = async (context: any) => {
  return {
    props: {
      ...(await getLocaleProps(context, ['Header', 'Footer', 'TextGeneratorPage'])),
    },
  };
}

export default TextGenerationPage;