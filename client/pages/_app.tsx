// pages/_app.tsx
import type { AppProps } from 'next/app';
import { I18nProvider } from '../lib/i18n'; // Mudamos para I18nProvider
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Usamos o I18nProvider e passamos a propriedade 'locale' de pageProps
    <I18nProvider locale={pageProps.locale}>
      <Component {...pageProps} />
    </I18nProvider>
  );
}

export default MyApp;