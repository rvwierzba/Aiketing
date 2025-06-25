// pages/history.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useI18n, getLocaleProps } from '../lib/i18n';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

// Definimos os tipos para os dados que esperamos da API
type HistoryItem = {
  id: number;
  timestamp: string;
  contentType: 'Text' | 'Image';
  inputPrompt: string;
};

const HistoryPage = () => {
  const t = useI18n();
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5235/api/history', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: HistoryItem[] = await response.json();
          setHistory(data);
        } else {
          setError(t('HistoryPage.ErrorLoading'));
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(t('HistoryPage.NetworkError'));
      } finally {
        setIsLoading(false);
      }
    };

    // Apenas busca o histórico se o usuário estiver logado
    if (isLoggedIn) {
      fetchHistory();
    }
  }, [isLoggedIn, router, t]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-brand-dark mb-6">
            {t('HistoryPage.Title')}
          </h1>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            {isLoading && <p>{t('HistoryPage.Loading')}</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && history.length === 0 && (
              <p>{t('HistoryPage.NoHistory')}</p>
            )}
            {!isLoading && !error && history.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('HistoryPage.Table.Date')}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('HistoryPage.Table.Type')}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('HistoryPage.Table.Prompt')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {history.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.timestamp).toLocaleString(router.locale)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.contentType === 'Text' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {item.contentType}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-sm truncate text-sm text-gray-900" title={item.inputPrompt}>
                          {item.inputPrompt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const getStaticProps = async (context: any) => {
  return {
    props: {
      ...(await getLocaleProps(context, ['Header', 'Footer', 'HistoryPage'])),
    },
  };
};

export default HistoryPage;