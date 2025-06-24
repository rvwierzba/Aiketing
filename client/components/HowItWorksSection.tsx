// components/HowItWorksSection.tsx
import { useScopedI18n } from '../lib/i18n';

const Step = ({ number, title, description }: { number: string; title: string; description: string }) => {
  return (
    <div className="flex">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-2xl">
          {number}
        </div>
      </div>
      <div className="ml-4">
        <h3 className="text-lg leading-6 font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-base text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export const HowItWorksSection = () => {
  const t = useScopedI18n('HowItWorks');

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t('Title')}
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            {t('Subtitle')}
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <Step number="1" title={t('Step1.Title')} description={t('Step1.Description')} />
          <Step number="2" title={t('Step2.Title')} description={t('Step2.Description')} />
          <Step number="3" title={t('Step3.Title')} description={t('Step3.Description')} />
        </div>
      </div>
    </section>
  );
};