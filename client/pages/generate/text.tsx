// =================================================================
// ARQUIVO: client/pages/generate/text.tsx (CORREÇÃO FINAL)
// =================================================================
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
  const [contentType, setContentType] = useState('instagramPost');
  const [topic, setTopic] = useState('');
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

    let translatedContentType = '';
    switch (contentType) {
      case 'instagramPost':
        translatedContentType = t('TextGeneratorPage.Templates.instagramPost');
        break;
      case 'twitterThread':
        translatedContentType = t('TextGeneratorPage.Templates.twitterThread');
        break;
      case 'reelsScript':
        translatedContentType = t('TextGeneratorPage.Templates.reelsScript');
        break;
      case 'emailMarketing':
        translatedContentType = t('TextGeneratorPage.Templates.emailMarketing');
        break;
    }
    
    const fullPrompt = `Crie um ${translatedContentType} sobre o seguinte tópico: "${topic}".`;
    
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
          <h1 className="text-3xl font-bold text-brand-dark mb-2">{t('TextGeneratorPage.Title')}</h1>
          <p className="text-brand-text mb-8">{t('TextGeneratorPage.Subtitle')}</p>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="contentType" className="block text-sm font-medium text-gray-700">{t('TextGeneratorPage.ContentTypeLabel')}</label>
                <select id="contentType" value={contentType} onChange={(e) => setContentType(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue">
                  <option value="instagramPost">{t('TextGeneratorPage.Templates.instagramPost')}</option>
                  <option value="twitterThread">{t('TextGeneratorPage.Templates.twitterThread')}</option>
                  <option value="reelsScript">{t('TextGeneratorPage.Templates.reelsScript')}</option>
                  <option value="emailMarketing">{t('TextGeneratorPage.Templates.emailMarketing')}</option>
                </select>
              </div>
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700">{t('TextGeneratorPage.TopicLabel')}</label>
                <textarea id="topic" rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" placeholder={t('TextGeneratorPage.TopicPlaceholder')} value={topic} onChange={(e) => setTopic(e.target.value)} required disabled={isLoading} />
              </div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-blue hover:opacity-90 disabled:bg-blue-300">
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

// CORREÇÃO FINAL E DEFINITIVA
export const getStaticProps = getLocaleProps();

export default TextGenerationPage;