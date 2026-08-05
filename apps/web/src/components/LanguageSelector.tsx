import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

/**
 * Componente selector de idioma
 * Permite cambiar el idioma de la aplicación dinámicamente
 */
export default function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <Select 
      value={i18n.language} 
      onValueChange={handleLanguageChange}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          {languages.find(lang => lang.code === i18n.language)?.flag}{' '}
          {languages.find(lang => lang.code === i18n.language)?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
