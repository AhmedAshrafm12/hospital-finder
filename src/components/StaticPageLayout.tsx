import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from './Navbar';
import Footer from './Footer';

interface StaticPageLayoutProps {
  imageUrl: string;
  endpoint: string; // The full API endpoint for this specific page
  title: string; // Static title from translations
  defaultContent: string; // Fallback content if API fails
}

const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({
  imageUrl,
  endpoint,
  title,
  defaultContent,
}) => {
  const { language } = useLanguage();
  const [content, setContent] = React.useState({
    content: defaultContent,
    loading: true,
    error: null as string | null,
  });

  React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(endpoint, {
            headers: {
                'language': language
              }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }

        const data = await response.json();
        setContent({
          content: data.content || defaultContent,
          loading: false,
          error: null,
        });
      } catch (error) {
        setContent(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load content',
        }));
      }
    };

    fetchContent();
  }, [endpoint, language, defaultContent]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-factories-slate/80 to-factories-blue/70 z-10"></div>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-[300px] object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&auto=format&fit=crop&q=80";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {title}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {content.loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-factories-blue"></div>
          </div>
        ) : content.error ? (
          <div className="text-center text-red-500 py-10">
            <p>{content.error}</p>
          </div>
        ) : (
          <div className={`prose max-w-none ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default StaticPageLayout; 