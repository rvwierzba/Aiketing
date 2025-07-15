// =================================================================
// ARQUIVO: client/pages/_app.tsx (ATUALIZADO)
// =================================================================
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { I18nProvider } from '../lib/i18n';
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  // A lógica do layout será aplicada dentro de cada página agora
  return (
    <I18nProvider locale={pageProps.locale}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </I18nProvider>
  );
}

export default MyApp;