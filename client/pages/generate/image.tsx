// =================================================================
// ARQUIVO: client/pages/generate/image.tsx (CORREÇÃO FINAL)
// =================================================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useI18n, getLocaleProps } from '../../lib/i18n';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

const ImageGenerationPage = () => {
  const t = useI18n();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
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
    setGeneratedImage(null);
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:5235/generate-image-test?prompt=${encodeURIComponent(prompt)}&style=digital%20art`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        if (data.base64Images && data.base64Images.length > 0) {
          setGeneratedImage(data.base64Images[0]);
        } else {
          setError(t('ImageGeneratorPage.NoImageReturned'));
        }
      } else {
        setError(data.message || t('ImageGeneratorPage.GenericError'));
      }
    } catch (err) {
      setError(t('ImageGeneratorPage.NetworkError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">{t('ImageGeneratorPage.Title')}</h1>
          <p className="text-brand-text mb-8">{t('ImageGeneratorPage.Subtitle')}</p>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">{t('ImageGeneratorPage.PromptLabel')}</label>
                  <textarea id="prompt" name="prompt" rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" placeholder={t('ImageGeneratorPage.PromptPlaceholder')} value={prompt} onChange={(e) => setPrompt(e.target.value)} required disabled={isLoading} />
                </div>
                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-blue hover:opacity-90 disabled:bg-blue-300">
                  {isLoading ? t('ImageGeneratorPage.Loading') : t('ImageGeneratorPage.ButtonText')}
                </button>
              </div>
            </form>
          </div>
          {error && <div className="mt-6 p-4 text-sm text-red-800 bg-red-100 rounded-md">{error}</div>}
          {isLoading && <p className="text-center mt-6">{t('ImageGeneratorPage.Loading')}</p>}
          {generatedImage && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold text-lg text-gray-900">{t('ImageGeneratorPage.ResultTitle')}</h3>
              <div className="mt-4 border rounded">
                <img src={generatedImage} alt={prompt} className="w-full h-auto rounded" />
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

export default ImageGenerationPage;