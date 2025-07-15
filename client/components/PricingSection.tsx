// components/PricingSection.tsx
import { useState } from 'react';
import { useI18n } from '../lib/i18n'; // MUDANÇA: Usando o hook principal
import { getStripe } from '../lib/stripe';
import { useRouter } from 'next/router';

// --- Tipos de Dados ---
type PlanId = 'Free' | 'Essential' | 'Pro';

interface Plan {
  id: PlanId;
  stripePriceId: string | null;
  isFeatured: boolean;
}

// O PlanCard continua sendo um componente "burro" que só recebe as props traduzidas.
// Isso é uma boa prática e mantém o código organizado.
interface PlanCardProps {
  plan: Plan;
  isFeatured: boolean;
  translations: {
    title: string;
    subtitle: string;
    price: string;
    period: string;
    features: string[];
    buttonText: string;
    loadingText: string;
  };
}

// --- Componente do Card do Plano (Sem nenhuma lógica de tradução) ---
const PlanCard = ({ plan, isFeatured, translations }: PlanCardProps) => {
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
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5235';
      const response = await fetch(`${apiUrl}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ priceId: plan.stripePriceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao processar o pagamento.');
      }

      const session = await response.json();
      const stripe = await getStripe();
      
      if (stripe && session.sessionId) {
        const { error } = await stripe.redirectToCheckout({ sessionId: session.sessionId });
        if (error) throw error;
      } else {
        throw new Error('Não foi possível iniciar a sessão de checkout.');
      }
    } catch (error) {
      console.error('Erro no Checkout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonBaseClass = "w-full mt-8 block py-3 px-6 text-center rounded-lg font-semibold transition-colors disabled:opacity-50";
  const featuredButtonClass = "bg-brand-blue text-white hover:opacity-90";
  const standardButtonClass = "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <div className={`border rounded-lg p-6 flex flex-col ${isFeatured ? 'border-brand-blue border-2' : 'border-gray-300'}`}>
      <h3 className="text-2xl font-bold text-gray-900">{translations.title}</h3>
      <p className="mt-2 text-gray-500">{translations.subtitle}</p>
      <div className="mt-6">
        <span className="text-4xl font-extrabold text-gray-900">{translations.price}</span>
        <span className="text-lg font-medium text-gray-500">/{translations.period}</span>
      </div>
      <ul className="mt-6 space-y-4 text-gray-600 flex-grow">
        {translations.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="flex-shrink-0 h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      {plan.id === 'Free' ? (
        <a href="/register" className={`${buttonBaseClass} ${isFeatured ? featuredButtonClass : standardButtonClass}`}>
          {translations.buttonText}
        </a>
      ) : (
        <button 
          onClick={handleCheckout} 
          disabled={isLoading} 
          className={`${buttonBaseClass} ${isFeatured ? featuredButtonClass : standardButtonClass}`}
        >
          {isLoading ? translations.loadingText : translations.buttonText}
        </button>
      )}
    </div>
  );
};

// --- Componente Principal da Seção de Preços (Com a lógica de tradução) ---
export const PricingSection = () => {
  // MUDANÇA CRÍTICA: Usando o hook principal `useI18n` uma única vez.
  const t = useI18n();
  
  const plansData: Plan[] = [
    { id: 'Free', stripePriceId: null, isFeatured: false },
    { id: 'Essential', stripePriceId: 'price_1RLu0XKYIkkrmcoGIFhnllPj', isFeatured: false },
    { id: 'Pro', stripePriceId: 'price_1RLu1fKYIkkrmcoGUM4ftzLJ', isFeatured: true },
  ];

  // A SOLUÇÃO FINAL:
  // Construímos o objeto de traduções usando o caminho completo e explícito para cada chave.
  // Isso elimina qualquer ambiguidade para o compilador do Next.js.
  const translationsMap = {
    Free: {
      title: t('Pricing.Plans.Free.Title'),
      subtitle: t('Pricing.Plans.Free.Subtitle'),
      price: t('Pricing.Plans.Free.Price'),
      period: t('Pricing.Plans.Free.Period'),
      features: [
        t('Pricing.Plans.Free.Features.0'),
        t('Pricing.Plans.Free.Features.1'),
        t('Pricing.Plans.Free.Features.2'),
      ],
      buttonText: t('Pricing.Plans.Free.ButtonText'),
      loadingText: t('Pricing.Plans.Free.LoadingText'),
    },
    Essential: {
      title: t('Pricing.Plans.Essential.Title'),
      subtitle: t('Pricing.Plans.Essential.Subtitle'),
      price: t('Pricing.Plans.Essential.Price'),
      period: t('Pricing.Plans.Essential.Period'),
      features: [
        t('Pricing.Plans.Essential.Features.0'),
        t('Pricing.Plans.Essential.Features.1'),
        t('Pricing.Plans.Essential.Features.2'),
      ],
      buttonText: t('Pricing.Plans.Essential.ButtonText'),
      loadingText: t('Pricing.Plans.Essential.LoadingText'),
    },
    Pro: {
      title: t('Pricing.Plans.Pro.Title'),
      subtitle: t('Pricing.Plans.Pro.Subtitle'),
      price: t('Pricing.Plans.Pro.Price'),
      period: t('Pricing.Plans.Pro.Period'),
      features: [
        t('Pricing.Plans.Pro.Features.0'),
        t('Pricing.Plans.Pro.Features.1'),
        t('Pricing.Plans.Pro.Features.2'),
      ],
      buttonText: t('Pricing.Plans.Pro.ButtonText'),
      loadingText: t('Pricing.Plans.Pro.LoadingText'),
    },
  };

  return (
    <section id="pricing" className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{t('Pricing.Title')}</h2>
        <p className="mt-4 text-xl text-gray-600">{t('Pricing.Subtitle')}</p>
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plansData.map(plan => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              isFeatured={plan.isFeatured} 
              translations={translationsMap[plan.id]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
