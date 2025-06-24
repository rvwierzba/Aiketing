// components/BenefitsSection.tsx
import { useScopedI18n } from '../lib/i18n';

// Um sub-componente para cada item de benefício
const BenefitItem = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Placeholder para um futuro ícone */}
      <div className="w-16 h-16 bg-blue-100 rounded-full mb-4 flex items-center justify-center">
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

// O componente principal da seção
export const BenefitsSection = () => {
  // Usamos um hook "escopado" para pegar só as traduções de "Benefits"
  const t = useScopedI18n('Benefits');

  return (
    <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t('Title')}
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <BenefitItem title={t('Time.Title')} description={t('Time.Description')} />
          <BenefitItem title={t('Quality.Title')} description={t('Quality.Description')} />
          <BenefitItem title={t('Autonomy.Title')} description={t('Autonomy.Description')} />
        </div>
      </div>
    </section>
  );
};