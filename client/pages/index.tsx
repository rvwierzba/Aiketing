// =================================================================
// ARQUIVO: client/pages/index.tsx (CORREÇÃO FINAL)
// =================================================================
import Head from 'next/head';
import { useI18n, useScopedI18n, getLocaleProps } from '../lib/i18n';
import { Header } from '../components/Header';
import { BenefitsSection } from '../components/BenefitsSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { PricingSection } from '../components/PricingSection';
import { CtaSection } from '../components/CtaSection';
import { Footer } from '../components/Footer';

const HomePage = () => {
  const t = useI18n();
  const scopedT = useScopedI18n('Home');

  return (
    <>
      <Head>
        <title>{scopedT('Title')}</title>
        <meta name="description" content={scopedT('Subtitle')} />
      </Head>
      <Header />
      <main className="flex flex-col items-center text-center px-4 py-20 md:py-32 bg-brand-light">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-brand-dark">
          {t('Home.Title')}
        </h1>
        <p className="mt-6 max-w-2xl text-lg md:text-xl text-brand-text">
          {t('Home.Subtitle')}
        </p>
        <a
          href="/register"
          className="mt-8 inline-block bg-brand-blue text-white font-bold text-lg px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          {t('Cta.ButtonText')}
        </a>
      </main>
      <BenefitsSection />
      <HowItWorksSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </>
  );
};

// CORREÇÃO FINAL E DEFINITIVA
export const getStaticProps = getLocaleProps();

export default HomePage;