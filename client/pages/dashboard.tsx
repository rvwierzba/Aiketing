// pages/dashboard.tsx
import { useState, useEffect } from 'react';
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
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Função para buscar os dados do dashboard na sua API
    const fetchDashboardData = async () => {
      // ATENÇÃO: Para isso funcionar, você precisa estar logado
      // e o token JWT precisa ser enviado na requisição.
      // Por enquanto, vamos simular isso. O próximo passo será integrar o login de verdade.
      
      // Simulação - Substituiremos isso pela chamada de API real
      console.log("Buscando dados do dashboard...");

      // Conectaremos isso à sua API em breve. Por enquanto, usamos dados de exemplo.
      const mockData = {
        planName: "AIketing Pro",
        textGenerationsUsed: 25,
        textGenerationsLimit: 200,
        thumbnailGenerationsUsed: 10,
        thumbnailGenerationsLimit: 100,
      };
      
      setSummary(mockData);
      setIsLoading(false);
    };

    fetchDashboardData();
  }, []); // O array vazio [] faz com que isso rode apenas uma vez quando a página carrega

  const renderContent = () => {
    if (isLoading) {
      return <p>{t('DashboardPage.Loading')}</p>;
    }

    if (error) {
      return <p className="text-red-500">{error}</p>;
    }

    if (summary) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg">{t('DashboardPage.TextUsage.Title')}</h3>
            <p className="text-3xl font-bold mt-2">{summary.textGenerationsUsed} / {summary.textGenerationsLimit}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(summary.textGenerationsUsed / summary.textGenerationsLimit) * 100}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg">{t('DashboardPage.ImageUsage.Title')}</h3>
            <p className="text-3xl font-bold mt-2">{summary.thumbnailGenerationsUsed} / {summary.thumbnailGenerationsLimit}</p>
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const getStaticProps = async (context: any) => {
  return {
    props: {
      ...(await getLocaleProps(context, ['Header', 'Footer', 'DashboardPage'])),
    },
  };
}

export default DashboardPage;