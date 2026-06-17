import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Button } from '../ui/button';
import { ArrowRight, TrendingUp, Users, Award, Star } from 'lucide-react';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => {
      // Use requestAnimationFrame for smoother performance on mobile
      window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.2; // Further reduced for performance

  // WhatsApp link
  const whatsappNumber = '+254713955653';
  const whatsappMessage = encodeURIComponent('Hello! I\'m interested in learning more about your in-house training programs.');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Optimized Unsplash URLs with better sizing and formatting for LCP
  const heroBgUrl = "https://images.unsplash.com/photo-1738750908048-14200459c3c9?auto=format&fit=crop&q=75&w=1600&h=900";
  const heroSideUrl = "https://images.unsplash.com/photo-1739302750695-31a8c978c770?auto=format&fit=crop&q=75&w=800&h=600";

  return (
    <section className="relative overflow-hidden min-h-[600px] flex items-center" style={{ backgroundColor: '#005A7C' }}>
      {/* Background Image with Parallax - Optimized with eager loading and high priority */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ 
          transform: `translate3d(0, ${parallaxOffset}px, 0)`,
          willChange: 'transform'
        }}
      >
        <img
          src={heroBgUrl}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, #005A7C, rgba(0, 90, 124, 0.9), rgba(0, 90, 124, 0.4))' }} />

      {/* Content */}
      <div className={`relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 md:pt-32 md:pb-48 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6 md:space-y-8">
            <div className="inline-block">
              <span className="bg-white/10 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm border border-white/20 flex items-center gap-2">
                <Star className="w-3 h-3 md:w-4 md:h-4 text-secondary fill-secondary" />
                East Africa's Premier Training Partner
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Transform Your Business Through{' '}
              <span className="text-secondary">Strategic Training</span>
            </h1>

            <p className="text-base md:text-xl text-gray-200 leading-relaxed max-w-2xl">
              Delivering comprehensive corporate training and consulting solutions across all industries. 
              We identify your training needs and enhance ROI through customized programs.
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-4">
              {[
                { icon: TrendingUp, title: "Proven ROI", sub: "Measurable results" },
                { icon: Users, title: "Expert Trainers", sub: "Industry leaders" },
                { icon: Award, title: "All Industries", sub: "Cross-sector expertise" }
              ].map((item, i) => (
                <div key={i} className="flex items-center sm:items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/10 sm:bg-transparent sm:p-0 sm:border-0">
                  <div className="bg-secondary p-2 rounded-lg flex-shrink-0">
                    <item.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">{item.title}</h3>
                    <p className="text-[10px] md:text-xs text-gray-300">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link to="/open-course-events" className="w-full sm:w-auto">
                <Button size="lg" className="bg-secondary text-white hover:bg-secondary/90 group w-full text-base h-14 px-8">
                  View upcoming courses events                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="bg-transparent text-white hover:bg-white hover:text-primary border-2 border-white w-full text-base h-14 px-8 font-semibold">
                  Request In-House Training
                </Button>
              </a>
            </div>
          </div>

          {/* Right Image - Optimized for Layout Shift */}
          <div className="hidden lg:block">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl bg-primary/20">
              <div className="absolute -inset-4 bg-gradient-to-r from-secondary to-orange-600 rounded-2xl blur-2xl opacity-20" />
              <img
                src={heroSideUrl}
                alt="Professional Training Session"
                className="w-full h-full object-cover relative z-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave - Optimized SVG */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-[100px] md:max-h-[150px] translate-y-[1px]" preserveAspectRatio="none">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}