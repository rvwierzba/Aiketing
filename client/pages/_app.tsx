// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { I18nProvider } from '../lib/i18n';
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <AuthProvider>
      <I18nProvider locale={pageProps.i18n}>
        <Component {...pageProps} />
      </I18nProvider>
    </AuthProvider>
  );
}

export default MyApp;