import React from 'react';
import StaticPageLayout from '@/components/StaticPageLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const HowToUse: React.FC = () => {
  const { t } = useLanguage();

  return (
    <StaticPageLayout
      imageUrl="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&auto=format&fit=crop&q=80"
      endpoint="https://back.factoriesguide.com/static-content?key=how_to_use"
      title={t('nav.howToUse')}
      defaultContent="Loading content..."
    />
  );
};

export default HowToUse; 