import React from 'react';
import StaticPageLayout from '@/components/StaticPageLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const Help: React.FC = () => {
  const { t } = useLanguage();

  return (
    <StaticPageLayout
      imageUrl="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80"
      endpoint="https://back.factoriesguide.com/static-content?key=help"
      title={t('nav.help')}
      defaultContent="Loading content..."
    />
  );
};

export default Help; 