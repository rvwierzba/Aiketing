// components/CtaSection.tsx
import { useScopedI18n } from '../lib/i18n';

export const CtaSection = () => {
  const t = useScopedI18n('Cta');

  return (
    <section className="bg-blue-600">
      <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          {t('Title')}
        </h2>
        <p className="mt-4 text-lg text-blue-100">
          {t('Subtitle')}
        </p>
        <a
          href="/register"
          className="mt-8 inline-block bg-white text-blue-600 font-bold text-lg px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          {t('ButtonText')}
        </a>
      </div>
    </section>
  );
};