import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from '@/contexts/LanguageContext';
import axios from 'axios';

interface RatingDialogProps {
  factoryId: number;
  isOpen: boolean;
  onClose: () => void;
  onRatingSubmit: () => void;
}

const RatingDialog = ({ factoryId, isOpen, onClose, onRatingSubmit }: RatingDialogProps) => {
  const { t, language } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || rating === 0) {
      setError(t('rating.fillAllFields'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await axios.post('https://back.factoriesguide.com/submit-rate', {
        company_id: factoryId,
        email,
        rating: rating
      },{headers: {
        'Content-Type': 'multipart/form-data',
      }});
      
      onRatingSubmit();
      onClose();
    } catch (err) {
      setError(t('rating.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('rating.title')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="focus:outline-none"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-factories-orange text-factories-orange'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t('form.email')}
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('rating.emailPlaceholder')}
              className="col-span-3"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('common.submitting') : t('rating.submit')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog; 