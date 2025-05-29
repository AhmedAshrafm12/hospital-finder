import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className={`bg-factories-slate text-white mt-16 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-12">
        {/* Logo and Description */}
        <div className="flex flex-col items-center mb-8">
      
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
          <Link to="/" className="text-gray-300 hover:text-white transition">
            {t('nav.home')}
          </Link>
          <Link to="/franchise-factories" className="text-gray-300 hover:text-white transition">
            {t('nav.franchiseFactories')}
          </Link>
          <Link to="/who-we-are" className="text-gray-300 hover:text-white transition">
            {t('nav.whoWeAre')}
          </Link>
          <Link to="/how-to-use" className="text-gray-300 hover:text-white transition">
            {t('nav.howToUse')}
          </Link>
          <Link to="/help" className="text-gray-300 hover:text-white transition">
            {t('nav.help')}
          </Link>
          <Link to="/terms" className="text-gray-300 hover:text-white transition">
            {t('nav.terms')}
          </Link>
          <Link to="/privacy" className="text-gray-300 hover:text-white transition">
            {t('nav.privacy')}
          </Link>
          <Link to="/contact-us" className="text-gray-300 hover:text-white transition">
            {t('nav.contactUs')}
          </Link>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Factory Directory. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
