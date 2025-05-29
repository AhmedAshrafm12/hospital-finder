import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Pages
import Index from "./pages/Index";
import Factories from "./pages/Factories";
import FranchiseFactories from "./pages/FranchiseFactories";
import FactoryDetail from "./pages/FactoryDetail";
import NotFound from "./pages/NotFound";
import WhoWeAre from "./pages/WhoWeAre";
import HowToUse from "./pages/HowToUse";
import Help from "./pages/Help";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ContactUs from "./pages/ContactUs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/factories" element={<Factories />} />
            <Route path="/franchise-factories" element={<FranchiseFactories />} />
            <Route path="/factory/:id" element={<FactoryDetail />} />
            <Route path="/who-we-are" element={<WhoWeAre />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/help" element={<Help />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
