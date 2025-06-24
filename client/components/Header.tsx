// components/Header.tsx
import { useI18n } from '../lib/i18n'; // Importamos nosso hook

export const Header = () => {
  const t = useI18n();

  const navLinkStyle = {
    color: '#333',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '16px',
  };

  const logoStyle = {
    fontWeight: 700,
    fontSize: '24px',
    color: '#111',
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      borderBottom: '1px solid #eee'
    }}>
      <div style={logoStyle}>
        AIketing
      </div>
      <nav style={{ display: 'flex', gap: '1.5rem' }}>
        <a href="/pricing" style={navLinkStyle}>{t('Header.Pricing')}</a>
        <a href="/dashboard" style={navLinkStyle}>{t('Header.Dashboard')}</a>
        <a href="/login" style={navLinkStyle}>{t('Header.Login')}</a>
      </nav>
    </header>
  );
};