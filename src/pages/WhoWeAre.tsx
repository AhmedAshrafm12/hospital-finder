import React from 'react';
import StaticPageLayout from '@/components/StaticPageLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const WhoWeAre: React.FC = () => {
  const { t } = useLanguage();

  return (
    <StaticPageLayout
      imageUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80"
      endpoint="https://back.factoriesguide.com/static-content?key=who_we_are"
      title={t('nav.whoWeAre')}
      defaultContent="Loading content..."
    />
  );
};

export default WhoWeAre; 