// pages/dashboard.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useI18n, getLocaleProps } from '../lib/i18n';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

// Definimos um tipo para os dados que esperamos da API
type DashboardSummary = {
  planName: string;
  textGenerationsUsed: number;
  textGenerationsLimit: number;
  thumbnailGenerationsUsed: number;
  thumbnailGenerationsLimit: number;
};

const DashboardPage = () => {
  const t = useI18n();
  const router = useRouter();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5235/api/dashboard/summary', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data: DashboardSummary = await response.json();
          setSummary(data);
        } else {
          setError(t('DashboardPage.AuthError'));
          localStorage.removeItem('authToken');
          router.push('/login');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(t('DashboardPage.NetworkError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router, t]);

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-gray-500">{t('DashboardPage.Loading')}</p>;
    }

    if (error) {
      return <p className="text-center text-red-600">{error}</p>;
    }

    if (summary) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg text-gray-700">{t('DashboardPage.TextUsage.Title')}</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">
              {summary.textGenerationsUsed} / {summary.textGenerationsLimit}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(summary.textGenerationsUsed / summary.textGenerationsLimit) * 100}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg text-gray-700">{t('DashboardPage.ImageUsage.Title')}</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">
              {summary.thumbnailGenerationsUsed} / {summary.thumbnailGenerationsLimit}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(summary.thumbnailGenerationsUsed / summary.thumbnailGenerationsLimit) * 100}%` }}></div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('DashboardPage.Title')}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('DashboardPage.Subtitle', { plan: summary?.planName || '...' })}
          </p>
          
          {renderContent()}

          {/* Seção de botões para as ferramentas */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <a 
              href="/generate/text"
              className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="text-4xl mb-2">✨</span>
              {t('DashboardPage.CtaButtonText')}
            </a>
            <a 
              href="/generate/image"
              className="flex flex-col items-center justify-center p-6 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 transition-colors"
            >
              <span className="text-4xl mb-2">🖼️</span>
              {t('DashboardPage.CtaButtonImage')}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Não se esqueça de adicionar as novas chaves de tradução em todos os seus locale.json!
export const getStaticProps = async (context: any) => {
  return {
    props: {
      ...(await getLocaleProps(context, ['Header', 'Footer', 'DashboardPage'])),
    },
  };
}

export default DashboardPage;