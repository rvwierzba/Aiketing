// components/PricingSection.tsx
import { useState } from 'react';
import { useScopedI18n } from '../lib/i18n';
import { getStripe } from '../lib/stripe';
import { useRouter } from 'next/router';
import Link from 'next/link';

const PlanCard = ({ plan, isFeatured }: { plan: { id: 'Free' | 'Essential' | 'Pro', stripePriceId: string | null }, isFeatured: boolean }) => {
  const t = useScopedI18n('Pricing.Plans');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (!plan.stripePriceId) {
      router.push('/register');
      return;
    }
    setIsLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const response = await fetch('http://localhost:5235/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ priceId: plan.stripePriceId }),
      });
      const session = await response.json();
      if (response.ok) {
        const stripe = await getStripe();
        await stripe!.redirectToCheckout({ sessionId: session.sessionId });
      } else {
        alert(`Erro: ${session.error?.message || 'Ocorreu um erro.'}`);
        setIsLoading(false);
      }
    } catch (error) {
      alert('Não foi possível conectar ao sistema de pagamento. Tente novamente.');
      setIsLoading(false);
    }
  };

  const buttonBaseClass = "w-full py-3 px-6 text-center rounded-lg font-semibold transition-colors disabled:opacity-50";
  const featuredButtonClass = "bg-brand-blue text-white hover:opacity-90";
  const standardButtonClass = "bg-gray-200 text-gray-800 hover:bg-gray-300";
  
  // CORREÇÃO: Pegamos o array de features antes de renderizar
  const features = t(`${plan.id}.Features`) as string[];

  return (
    <div className={`border rounded-lg p-6 flex flex-col ${isFeatured ? 'border-brand-blue border-2' : 'border-gray-300'}`}>
      <h3 className="text-2xl font-bold text-gray-900">{t(`${plan.id}.Title`)}</h3>
      <p className="mt-2 text-gray-500">{t(`${plan.id}.Subtitle`)}</p>
      <div className="mt-6">
        <span className="text-4xl font-extrabold text-gray-900">{t(`${plan.id}.Price`)}</span>
        <span className="text-lg font-medium text-gray-500">/{t(`${plan.id}.Period`)}</span>
      </div>
      <ul className="mt-6 space-y-4 text-gray-600 flex-grow">
        {/* CORREÇÃO DEFINITIVA: Mapeamos o array diretamente, sem o callback na função t() */}
        {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="flex-shrink-0 h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature}</span>
            </li>
          ))
        }
      </ul>
      <button onClick={handleCheckout} disabled={isLoading || plan.id === 'Free'} className={`mt-8 block ${isFeatured ? featuredButtonClass : standardButtonClass}`}>
        {isLoading ? t(`${plan.id}.LoadingText`) : t(`${plan.id}.ButtonText`)}
      </button>
    </div>
  );
};


export const PricingSection = () => {
  const t = useScopedI18n('Pricing');
  
  const plansData = [
    { id: 'Free', stripePriceId: null, isFeatured: false },
    { id: 'Essential', stripePriceId: 'price_1RLu0XKYIkkrmcoGIFhnllPj', isFeatured: false },
    { id: 'Pro', stripePriceId: 'price_1RLu1fKYIkkrmcoGUM4ftzLJ', isFeatured: true },
  ] as const;

  return (
    <section id="pricing" className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{t('Title')}</h2>
        <p className="mt-4 text-xl text-gray-600">{t('Subtitle')}</p>
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plansData.map(plan => (
            <PlanCard key={plan.id} plan={plan} isFeatured={plan.isFeatured} />
          ))}
        </div>
      </div>
    </section>
  );
};
