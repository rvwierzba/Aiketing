// =================================================================
// ARQUIVO NOVO: client/components/DashboardLayout.tsx (NOVO)
// =================================================================
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useI18n } from '../lib/i18n';
import { useAuth } from '../context/AuthContext';
import { Header } from './Header'; // Reutilizamos o Header
import { Footer } from './Footer'; // Reutilizamos o Footer

// Ícones simples para o menu
const ProjectIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const SettingsIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useI18n();
  const { logout } = useAuth();
  const router = useRouter();

  const menuItems = [
    { href: '/projects', label: 'Meus Projetos', icon: <ProjectIcon /> },
    { href: '/settings', label: 'Configurações', icon: <SettingsIcon /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
          <nav>
            <ul>
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`flex items-center gap-4 px-4 py-3 rounded-lg font-semibold ${router.pathname.startsWith(item.href) ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button onClick={logout} className="flex items-center gap-4 px-4 py-3 rounded-lg font-semibold text-gray-600 hover:bg-gray-100">
            <LogoutIcon />
            <span>{t('Header.Logout')}</span>
          </button>
        </aside>
        <main className="flex-1 p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};