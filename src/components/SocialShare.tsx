
import React from 'react';
import { Facebook, Twitter, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface SocialShareProps {
  url: string;
  title: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title }) => {
  const { language } = useLanguage();
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`,
  };
  
  const handleShare = (platform: string) => {
    const shareUrl = shareLinks[platform as keyof typeof shareLinks];
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => handleShare('facebook')} 
        className="rounded-full"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => handleShare('twitter')} 
        className="rounded-full"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => handleShare('whatsapp')} 
        className="rounded-full"
        aria-label="Share on WhatsApp"
      >
        {/* Replace WhatsApp with a custom SVG icon since it's not available in lucide-react */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.72 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z" />
          <path d="M20.52 3.449C12.831-3.984.106 1.407.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.715 1.447h.006c10.345 0 18.45-8.384 18.45-18.699 0-4.995-1.943-9.69-5.476-13.225l-.51-.422zM12.055 21.797h-.004c-2.801-.002-5.54-.757-7.931-2.183l-.568-.338-5.905 1.546 1.575-5.705-.372-.588C-2.4 11.562-.523 5.008 4.16 1.865 8.849-1.27 15.416.702 18.557 5.391c3.141 4.69 1.166 11.076-3.522 14.214-1.803 1.455-4.013 2.191-6.281 2.192h-.699z" />
        </svg>
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full"
        aria-label="Share"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: title,
              url: url
            });
          }
        }}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SocialShare;
