import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Add AgreementText component
const AgreementText = () => {
  const { language } = useLanguage();
  
  return (
    <span className="text-sm">
      {language === 'ar' ? (
        <>
          أوافق على{' '}
          <Link to="/terms" className="text-factories-blue hover:underline">
            الشروط والأحكام
          </Link>
          {' '}لحجز زيارة المصنع
        </>
      ) : (
        <>
          I agree to the{' '}
          <Link to="/terms" className="text-factories-blue hover:underline">
            Terms and Conditions
          </Link>
          {' '}for booking a factory visit
        </>
      )}
    </span>
  );
};

interface BookingFormProps {
  factoryId: number;
}

const BookingForm = ({ factoryId }: BookingFormProps) => {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    agreement: false
  });
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreement) {
      setError(t('booking.agreementRequired'));
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const submitData = new FormData();
    submitData.append('recipientable_id', factoryId.toString());
    submitData.append('name', formData.name);
    submitData.append('phone', formData.phone);
    submitData.append('email', formData.email);
    submitData.append('message', formData.message);
    if (file) {
      submitData.append('file', file);
    }

    try {
      await axios.post('https://back.factoriesguide.com/booking-appointment', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
        agreement: false
      });
      setFile(null);
    } catch (err) {
      setError(t('booking.submitError'));
      console.error('Booking submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">{`${t('form.name')} *`}</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full"
        />
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <Label htmlFor="phone">{`${t('form.phone')} *`}</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          required
          className="w-full"
        />
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">{`${t('form.email')} *`}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full"
        />
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="file">{t('booking.file')}</Label>
        <Input
          id="file"
          name="file"
          type="file"
          onChange={handleFileChange}
          className="w-full"
          accept=".pdf,.doc,.docx,.txt"
        />
        <p className="text-sm text-gray-500">
          {t('booking.fileTypes')}
        </p>
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <Label htmlFor="message">{`${t('form.message')} *`}</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          className="w-full min-h-[100px]"
        />
      </div>

      {/* Agreement Checkbox */}
      <div className="flex items-start space-x-2 rtl:space-x-reverse">
        <Checkbox
          id="agreement"
          checked={formData.agreement}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ ...prev, agreement: checked as boolean }))
          }
        />
        <Label 
          htmlFor="agreement" 
          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          <AgreementText />
        </Label>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Success Message */}
      {success && (
        <p className="text-green-500 text-sm">{t('booking.success')}</p>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? t('common.submitting') : t('booking.submit')}
      </Button>
    </form>
  );
};

export default BookingForm;
