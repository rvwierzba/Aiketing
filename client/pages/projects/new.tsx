// =================================================================
// ARQUIVO NOVO: client/pages/projects/new.tsx (NOVO)
// =================================================================
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useI18n, getLocaleProps } from '../../lib/i18n';
import { DashboardLayout } from '../../components/DashboardLayout';

const NewProjectPage = () => {
  const t = useI18n();
  const router = useRouter();
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Lógica para chamar a API e criar o projeto
    console.log({ projectName, projectDesc });
    // Após sucesso, redirecionar para a página do projeto:
    // router.push('/projects/ID_DO_NOVO_PROJETO');
    // Por enquanto, apenas voltamos para a lista:
    setTimeout(() => router.push('/projects'), 1000);
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-brand-dark mb-8">Criar Novo Projeto</h1>
      <div className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Nome do Projeto</label>
            <input type="text" id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
          </div>
          <div>
            <label htmlFor="projectDesc" className="block text-sm font-medium text-gray-700">Descrição (Opcional)</label>
            <textarea id="projectDesc" rows={4} value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => router.push('/projects')} className="bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="bg-brand-blue text-white font-bold px-6 py-2 rounded-lg hover:opacity-90 disabled:bg-blue-300">
              {isLoading ? "Criando..." : "Criar Projeto"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export const getStaticProps = async (context: any) => {
  return await getLocaleProps(context);
};

export default NewProjectPage;