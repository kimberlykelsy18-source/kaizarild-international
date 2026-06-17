import { useEffect, useRef, lazy, Suspense } from 'react';
import HeroSection from '../components/home/HeroSection';
import { motion } from 'motion/react';

// Lazy load below-the-fold components
const ServicesSection = lazy(() => import('../components/home/ServicesSection'));
const IndustriesSection = lazy(() => import('../components/home/IndustriesSection'));
const CertificationSection = lazy(() => import('../components/home/CertificationSection'));
const ClientLogos = lazy(() => import('../components/home/ClientLogos'));
const MetricsSection = lazy(() => import('../components/home/MetricsSection'));
const TestimonialsSection = lazy(() => import('../components/home/TestimonialsSection'));
const LMSSection = lazy(() => import('../components/home/LMSSection'));
const LatestInsights = lazy(() => import('../components/home/LatestInsights'));
const CTASection = lazy(() => import('../components/home/CTASection'));
const LMSPopup = lazy(() => import('../components/LMSPopup'));

// Section Placeholder for lazy loading
const SectionPlaceholder = ({ height = '400px' }: { height?: string }) => (
  <div style={{ height }} className="w-full bg-gray-50/50 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

// Wrapper for scroll animations using Motion for reliability
const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  // Pre-load critical components on mount if needed, but lazy is fine for below-the-fold
  
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero is critical, load immediately */}
      <HeroSection />
      
      {/* Client Logos Strip - High social proof, immediately after hero */}
      <Suspense fallback={<div className="h-32" />}>
        <ClientLogos />
      </Suspense>
      
      <main>
        <ScrollReveal>
          <Suspense fallback={<SectionPlaceholder height="500px" />}>
            <ServicesSection />
          </Suspense>
        </ScrollReveal>
        
        <ScrollReveal>
          <Suspense fallback={<SectionPlaceholder height="600px" />}>
            <IndustriesSection />
          </Suspense>
        </ScrollReveal>
        
        <ScrollReveal>
          <Suspense fallback={<SectionPlaceholder height="300px" />}>
            <MetricsSection />
          </Suspense>
        </ScrollReveal>
        
        <ScrollReveal>
          <Suspense fallback={<SectionPlaceholder height="400px" />}>
            <CertificationSection />
          </Suspense>
        </ScrollReveal>
        
        <ScrollReveal>
          <Suspense fallback={<SectionPlaceholder height="600px" />}>
            <LMSSection />
          </Suspense>
        </ScrollReveal>
        
        <ScrollReveal>
          <Suspense fallback={<SectionPlaceholder height="500px" />}>
            <TestimonialsSection />
          </Suspense>
        </ScrollReveal>
        
        <ScrollReveal>
          <Suspense fallback={<SectionPlaceholder height="500px" />}>
            <LatestInsights />
          </Suspense>
        </ScrollReveal>
        
        <ScrollReveal>
          <Suspense fallback={<SectionPlaceholder height="400px" />}>
            <CTASection />
          </Suspense>
        </ScrollReveal>
      </main>

      {/* LMS Popup - Defer loading */}
      <Suspense fallback={null}>
        <LMSPopup />
      </Suspense>
    </div>
  );
}
