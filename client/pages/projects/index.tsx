// =================================================================
// ARQUIVO: client/pages/dashboard.tsx (RENOMEAR PARA client/pages/projects/index.tsx)
// =================================================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useI18n, getLocaleProps } from '../../lib/i18n';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/DashboardLayout';
import Link from 'next/link';

// Mock data para simular projetos existentes
const mockProjects = [
  { id: 1, name: 'Lançamento Perfume Café', description: 'Campanha de marketing para o novo perfume com notas de café.' },
  { id: 2, name: 'Promoção Dia das Mães', description: 'Ações e posts para a semana do Dia das Mães.' },
  { id: 3, name: 'Conteúdo Institucional 2025', description: 'Posts para reforço de marca ao longo do ano.' },
];

const ProjectsPage = () => {
  const t = useI18n();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  
  useEffect(() => {
    if (isLoggedIn === false) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    // Pode mostrar um loader aqui também para evitar piscar a tela
    return null; 
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-dark">Meus Projetos</h1>
        <Link href="/projects/new" className="bg-brand-blue text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
          + Criar Novo Projeto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map(project => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-gray-800">{project.name}</h2>
            <p className="mt-2 text-gray-600 flex-grow">{project.description}</p>
            <button className="mt-6 w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300">
              Abrir Projeto
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export const getStaticProps = async (context: any) => {
  return await getLocaleProps(context);
};

export default ProjectsPage;
