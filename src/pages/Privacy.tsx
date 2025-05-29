import React from 'react';
import StaticPageLayout from '@/components/StaticPageLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const Privacy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <StaticPageLayout
      imageUrl="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=1200&auto=format&fit=crop&q=80"
      endpoint="https://back.factoriesguide.com/static-content?key=privacy"
      title={t('nav.privacy')}
      defaultContent="Loading content..."
    />
  );
};

export default Privacy; 