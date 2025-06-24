// components/PricingSection.tsx
import { useScopedI18n } from '../lib/i18n';

const PlanCard = ({ plan, isFeatured }: { plan: any; isFeatured: boolean }) => {
  const t = useScopedI18n(`Pricing.Plans.${plan}`);

  const buttonBaseClass = "w-full py-3 px-6 text-center rounded-lg font-semibold transition-colors";
  const featuredButtonClass = "bg-blue-600 text-white hover:bg-blue-700";
  const standardButtonClass = "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <div className={`border rounded-lg p-6 flex flex-col ${isFeatured ? 'border-blue-600 border-2' : 'border-gray-300'}`}>
      <h3 className="text-2xl font-bold text-gray-900">{t('Title')}</h3>
      <p className="mt-2 text-gray-500">{t('Subtitle')}</p>
      <div className="mt-6">
        <span className="text-4xl font-extrabold text-gray-900">${t('Price')}</span>
        <span className="text-lg font-medium text-gray-500">/{t('Period')}</span>
      </div>
      <ul className="mt-6 space-y-4 text-gray-600 flex-grow">
        {t('Features', {}, (features) =>
          (features as string[]).map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="flex-shrink-0 h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature}</span>
            </li>
          ))
        )}
      </ul>
      <a href="/register" className={`mt-8 block ${isFeatured ? featuredButtonClass : standardButtonClass}`}>
        {t('ButtonText')}
      </a>
    </div>
  );
};


export const PricingSection = () => {
  const t = useScopedI18n('Pricing');

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          {t('Title')}
        </h2>
        <p className="mt-4 text-xl text-gray-600">
          {t('Subtitle')}
        </p>
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <PlanCard plan="Free" isFeatured={false} />
          <PlanCard plan="Essential" isFeatured={false} />
          <PlanCard plan="Pro" isFeatured={true} />
        </div>
      </div>
    </section>
  );
};