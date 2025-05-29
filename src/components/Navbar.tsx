import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages, ChevronDown, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from './Logo';

const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handlePayHereClick = (e: React.MouseEvent) => {
    e.preventDefault();
    formRef.current?.submit();
  };

  const PayHereForm = () => (
    <form
      ref={formRef}
      method="GET"
      action="https://back.factoriesguide.com/go-to-paypal" // Replace with your actual payment URL
      className="inline"
      target="_blank"
    >
      {/* Add any hidden fields needed for the payment form */}
      <input type="hidden" name="hosted_button_id" value="QG3Y69J3DLH6L" />
      <input type="hidden" name="cmd" value="_s-xclick"/>
      <button
        type="submit"
        onClick={handlePayHereClick}
        className="paypal font-medium text-factories-slate hover:text-factories-blue transition duration-300"
      >
        {t('nav.payHere')}
      </button>
    </form>
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6 min-h-[80px]">
        <div className="flex items-center justify-between">
          {/* Logo and Main Links */}
          <div className={`flex items-center space-x-8 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
            <div className={`hidden sm:flex items-center space-x-8 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
              <Link to="/" className="font-medium text-factories-slate hover:text-factories-blue transition duration-300">
                {t('nav.home')}
              </Link>
              <a 
                href="https://company.back.factoriesguide.com/login" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium text-factories-slate hover:text-factories-blue transition duration-300"
              >
                {t('nav.login')}
              </a>
              <a 
                href="https://company.back.factoriesguide.com/register" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium text-factories-slate hover:text-factories-blue transition duration-300"
              >
                {t('nav.register')}
              </a>
            </div>
          </div>

          {/* Desktop Right Menu */}
          <div className={`hidden md:flex items-center space-x-8 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
            <Link 
              to="/franchise-factories" 
              className="font-medium text-factories-slate hover:text-factories-blue transition duration-300"
            >
              {t('nav.franchiseFactories')}
            </Link>
            <PayHereForm />
            
            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium text-factories-slate hover:text-factories-blue transition duration-300">
                  {t('nav.more')} <ChevronDown className={`h-4 w-4 ${language === 'ar' ? 'mr-1' : 'ml-1'}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={language === 'ar' ? 'rtl' : 'ltr'}>
                <DropdownMenuItem asChild>
                  <Link to="/who-we-are" className="w-full">
                    {t('nav.whoWeAre')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/how-to-use" className="w-full">
                    {t('nav.howToUse')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/help" className="w-full">
                    {t('nav.help')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/terms" className="w-full">
                    {t('nav.terms')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/privacy" className="w-full">
                    {t('nav.privacy')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/contact-us" className="w-full">
                    {t('nav.contactUs')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleLanguage}
              className="flex items-center gap-1"
            >
              <Languages className="h-4 w-4" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleLanguage}
              className="flex items-center gap-1"
            >
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">{language === 'en' ? 'العربية' : 'English'}</span>
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side={language === 'ar' ? 'right' : 'left'} className={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="flex flex-col space-y-4 mt-6">
                  {/* Only show these links in mobile menu if screen is extra small */}
                  <div className="sm:hidden space-y-4">
                    <Link 
                      to="/" 
                      className="block font-medium text-factories-slate hover:text-factories-blue transition duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.home')}
                    </Link>
                    <a 
                      href="https://auth.example.com/login" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block font-medium text-factories-slate hover:text-factories-blue transition duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.login')}
                    </a>
                    <a 
                      href="https://auth.example.com/register" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block font-medium text-factories-slate hover:text-factories-blue transition duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.register')}
                    </a>
                    <div className="h-px bg-gray-200" />
                  </div>
                  <div className="space-y-4">
                    <Link 
                      to="/franchise-factories" 
                      className="block font-medium text-factories-slate hover:text-factories-blue transition duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.franchiseFactories')}
                    </Link>
                    <PayHereForm />
                  </div>
                  <div className="h-px bg-gray-200" />
                  <Link 
                    to="/who-we-are" 
                    className="font-medium text-factories-slate hover:text-factories-blue transition duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.whoWeAre')}
                  </Link>
                  <Link 
                    to="/how-to-use" 
                    className="font-medium text-factories-slate hover:text-factories-blue transition duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.howToUse')}
                  </Link>
                  <Link 
                    to="/help" 
                    className="font-medium text-factories-slate hover:text-factories-blue transition duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.help')}
                  </Link>
                  <Link 
                    to="/terms" 
                    className="font-medium text-factories-slate hover:text-factories-blue transition duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.terms')}
                  </Link>
                  <Link 
                    to="/privacy" 
                    className="font-medium text-factories-slate hover:text-factories-blue transition duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.privacy')}
                  </Link>
                  <Link 
                    to="/contact-us" 
                    className="font-medium text-factories-slate hover:text-factories-blue transition duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {t('nav.contactUs')}
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
