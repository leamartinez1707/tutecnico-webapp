import { useTranslation } from 'react-i18next';

/**
 * Ejemplo de uso de traducciones en un componente
 */
export default function ExampleTranslatedComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('common.loading')}</h1>
      <button>{t('common.save')}</button>
      <button>{t('common.cancel')}</button>
      
      {/* Con interpolación de variables */}
      <p>{t('errors.rateLimitWait', { seconds: 30 })}</p>
      
      {/* Acceso directo por clave */}
      <p>{t('auth.login')}</p>
    </div>
  );
}
