import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
}

interface RatingModalProps {
  factoryId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RatingModal({ factoryId, isOpen, onClose, onSuccess }: RatingModalProps) {
  const { language, t } = useLanguage() as LanguageContextType;
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError(t('rating.pleaseSelectRating'));
      return;
    }
    if (!email) {
      setError(t('rating.pleaseEnterEmail'));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('rating.invalidEmail'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://back.factoriesguide.com/rate', {
        factory_id: factoryId,
        rating,
        email,
      });

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || t('rating.errorSubmitting'));
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError(t('rating.errorSubmitting'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={language === 'ar' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle>{t('rating.title')}</DialogTitle>
          <DialogDescription>{t('rating.description')}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Rating Stars */}
          <div className="flex flex-col gap-2">
            <Label>{t('rating.ratingLabel')}</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-factories-orange text-factories-orange'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{t('rating.emailLabel')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('rating.emailPlaceholder')}
              dir="ltr"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>

        <DialogFooter className={language === 'ar' ? 'flex-row-reverse' : ''}>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className={loading ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {loading ? t('common.submitting') : t('rating.submit')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 