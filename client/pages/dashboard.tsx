// pages/dashboard.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useI18n, getLocaleProps } from '../lib/i18n';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../lib/apiConfig';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import Link from 'next/link';

type DashboardSummary = {
  planName: string;
  textGenerationsLimit: number;
  thumbnailGenerationsLimit: number;
};

const DashboardPage = () => {
  const t = useI18n();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn === false) {
      router.push('/login');
      return;
    }

    if (isLoggedIn === true) {
      const token = localStorage.getItem('authToken');
      const fetchDashboardData = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/dashboard/summary`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (response.ok) {
            const data: DashboardSummary = await response.json();
            setSummary(data);
          } else {
            setError(t('DashboardPage.AuthError'));
            localStorage.removeItem('authToken'); // Limpa token inválido
            router.push('/login');
          }
        } catch (err) {
          setError(t('DashboardPage.NetworkError'));
        } finally {
          setIsLoading(false);
        }
      };
      fetchDashboardData();
    }
  }, [isLoggedIn, router, t]);

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-gray-500">{t('DashboardPage.Loading')}</p>;
    }
    if (error) {
      return <p className="text-center text-red-600">{error}</p>;
    }
    if (summary) {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg text-gray-700">{t('DashboardPage.TextUsage.Title')}</h3>
              <p className="text-3xl font-bold mt-2 text-gray-900">0 / {summary.textGenerationsLimit}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg text-gray-700">{t('DashboardPage.ImageUsage.Title')}</h3>
              <p className="text-3xl font-bold mt-2 text-gray-900">0 / {summary.thumbnailGenerationsLimit}</p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/generate/text" className="flex flex-col items-center justify-center p-6 bg-brand-blue text-white font-bold text-lg rounded-lg hover:opacity-90 transition-all">
              <span className="text-4xl mb-2">✨</span>
              {t('DashboardPage.CtaButtonText')}
            </Link>
            <Link href="/generate/image" className="flex flex-col items-center justify-center p-6 bg-green-600 text-white font-bold text-lg rounded-lg hover:bg-green-700 transition-colors">
              <span className="text-4xl mb-2">🖼️</span>
              {t('DashboardPage.CtaButtonImage')}
            </Link>
          </div>
        </>
      );
    }
    return null;
  };
  
  if (isLoggedIn === null) {
      return <div className="flex flex-col min-h-screen bg-gray-100"></div>; // Página em branco enquanto verifica
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">
            {t('DashboardPage.Title')}
          </h1>
          <p className="text-brand-text mb-8">
            {t('DashboardPage.Subtitle', { plan: summary?.planName || '...' })}
          </p>
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const getStaticProps = async (context: any) => {
  return { props: { ...(await getLocaleProps(context, ['Header', 'Footer', 'DashboardPage'])) } };
};

export default DashboardPage;