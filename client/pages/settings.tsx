// =================================================================
// ARQUIVO NOVO: client/pages/settings.tsx (NOVO)
// =================================================================
import { useI18n, getLocaleProps } from '../lib/i18n';
import { DashboardLayout } from '../components/DashboardLayout';

const SettingsPage = () => {
  const t = useI18n();

  const handleManageSubscription = () => {
    // Lógica para criar uma sessão no Stripe Customer Portal e redirecionar
    alert('Redirecionando para o portal de assinaturas...');
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Configurações da Conta</h1>
      <div className="space-y-10">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Gerenciar Assinatura</h2>
          <p className="text-gray-600 mb-4">Clique no botão abaixo para gerenciar seu plano, atualizar seu método de pagamento ou cancelar sua assinatura.</p>
          <button onClick={handleManageSubscription} className="bg-brand-blue text-white font-bold px-6 py-3 rounded-lg hover:opacity-90">
            Acessar Portal de Assinaturas
          </button>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Alterar Senha</h2>
          <form className="space-y-4 max-w-sm">
             <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Senha Atual</label>
              <input type="password" id="currentPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
             <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nova Senha</label>
              <input type="password" id="newPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <button type="submit" className="bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-800">
              Salvar Nova Senha
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export const getStaticProps = async (context: any) => {
  return await getLocaleProps(context);
};

export default SettingsPage;