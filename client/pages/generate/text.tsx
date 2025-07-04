// pages/generate/text.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useI18n, getLocaleProps } from '../../lib/i18n';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../lib/apiConfig';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

const TextGenerationPage = () => {
  const t = useI18n();
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  // Estados do formulário
  const [contentType, setContentType] = useState('instagramPost');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Amigável');

  // Estados do resultado
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn === false) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedText('');

    // Criamos um prompt mais detalhado e estruturado para a IA
    const fullPrompt = `Crie um ${t(`TextGeneratorPage.Templates.${contentType}`)} sobre o seguinte tópico: "${topic}". O tom de voz deve ser ${tone}. Inclua 3 hashtags relevantes.`;
    
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`${API_BASE_URL}/generate-text?prompt=${encodeURIComponent(fullPrompt)}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedText(data.generatedText);
      } else {
        setError(data.message || t('TextGeneratorPage.GenericError'));
      }
    } catch (err) {
      setError(t('TextGeneratorPage.NetworkError'));
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isLoggedIn) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">
            {t('TextGeneratorPage.Title')}
          </h1>
          <p className="text-brand-text mb-8">
            {t('TextGeneratorPage.Subtitle')}
          </p>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="contentType" className="block text-sm font-medium text-gray-700">{t('TextGeneratorPage.ContentTypeLabel')}</label>
                <select id="contentType" value={contentType} onChange={(e) => setContentType(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue">
                  <option value="instagramPost">{t('TextGeneratorPage.Templates.Instagram')}</option>
                  <option value="twitterThread">{t('TextGeneratorPage.Templates.Twitter')}</option>
                  <option value="reelsScript">{t('TextGeneratorPage.Templates.Reels')}</option>
                  <option value="emailMarketing">{t('TextGeneratorPage.Templates.Email')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700">{t('TextGeneratorPage.TopicLabel')}</label>
                <textarea id="topic" rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                  placeholder={t('TextGeneratorPage.TopicPlaceholder')}
                  value={topic} onChange={(e) => setTopic(e.target.value)} required disabled={isLoading}
                />
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-blue hover:opacity-90 disabled:bg-blue-300">
                {isLoading ? t('TextGeneratorPage.Loading') : t('TextGeneratorPage.ButtonText')}
              </button>
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
  return { props: { ...(await getLocaleProps(context, ['Header', 'Footer', 'TextGeneratorPage'])) } };
}

export default TextGenerationPage;