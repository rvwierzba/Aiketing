// pages/index.tsx
import { useI18n, getLocaleProps } from '../lib/i18n';
import { Header } from '../components/Header';
import { BenefitsSection } from '../components/BenefitsSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { PricingSection } from '../components/PricingSection'; // 1. IMPORTE AQUI

const HomePage = () => {
  const t = useI18n();

  return (
    <>
      <Header />
      <main className="flex flex-col items-center text-center px-4 py-20 md:py-32">
        {/* ... código da seção Hero ... */}
      </main>
      <BenefitsSection />
      <HowItWorksSection />
      <PricingSection /> {/* 2. ADICIONE A SEÇÃO AQUI */}
    </>
  );
};

export const getStaticProps = async (context: any) => {
  return {
    props: {
      // 3. ADICIONE O NOVO ESCOPO DE TRADUÇÃO
      ...(await getLocaleProps(context, ['Home', 'Header', 'Benefits', 'HowItWorks', 'Pricing'])),
    },
  };
}

export default HomePage;