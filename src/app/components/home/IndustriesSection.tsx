import { useState } from 'react';
import { industries } from '../../data/industries';
import { 
  Tractor, 
  TrendingUp, 
  Factory, 
  Home, 
  Ship, 
  Cpu, 
  Briefcase, 
  Shield 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Link } from 'react-router';
import { Button } from '../ui/button';

const industryIcons: Record<string, any> = {
  'agriculture': Tractor,
  'finance': TrendingUp,
  'manufacturing': Factory,
  'real-estate': Home,
  'import-export': Ship,
  'ai-tech': Cpu,
  'business-marketing': Briefcase,
  'insurance': Shield,
};

export default function IndustriesSection() {
  const [selectedIndustry, setSelectedIndustry] = useState<typeof industries[0] | null>(null);

  const handleIndustryClick = (industry: typeof industries[0]) => {
    setSelectedIndustry(industry);
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
            Industries We Serve
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            We identify training needs and deliver customized solutions across diverse sectors, 
            enhancing ROI and driving business excellence in every industry we serve.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry) => {
            const Icon = industryIcons[industry.id] || Briefcase;
            return (
              <div
                key={industry.id}
                onClick={() => handleIndustryClick(industry)}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:border-primary/50 active:shadow-2xl active:border-primary transition-all duration-300 group cursor-pointer flex flex-col h-full touch-manipulation"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-active:bg-primary group-hover:scale-110 group-active:scale-110 transition-all">
                  <Icon className="w-6 h-6 text-primary group-hover:text-white group-active:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {industry.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 flex-grow">
                  {industry.subCategories.length} specialized sectors covered
                </p>
                <div className="text-xs text-primary font-medium group-hover:underline group-active:underline mt-auto pt-4 border-t border-gray-100 flex items-center">
                  View sub-categories 
                  <span className="ml-1 group-hover:translate-x-1 group-active:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Training Approach */}
        <div className="mt-12 md:mt-16 bg-primary rounded-2xl p-6 md:p-10 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl md:text-3xl font-bold mb-4">
              Our Industry-Specific Approach
            </h3>
            <p className="text-sm md:text-lg text-white/90 mb-8 leading-relaxed">
              We don't offer one-size-fits-all solutions. Our expert team conducts thorough 
              training needs assessments for your specific industry sector, then designs and 
              delivers programs that address your unique challenges and opportunities.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">1.</div>
                <p className="text-sm md:text-lg font-semibold mb-0.5 md:mb-1">Identify Needs</p>
                <p className="text-xs md:text-sm text-white/70">Industry-specific assessment</p>
              </div>
              <div className="border-t border-white/10 pt-4 sm:border-0 sm:pt-0">
                <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">2.</div>
                <p className="text-sm md:text-lg font-semibold mb-0.5 md:mb-1">Design Program</p>
                <p className="text-xs md:text-sm text-white/70">Customized training solution</p>
              </div>
              <div className="border-t border-white/10 pt-4 sm:border-0 sm:pt-0">
                <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">3.</div>
                <p className="text-sm md:text-lg font-semibold mb-0.5 md:mb-1">Deliver Results</p>
                <p className="text-xs md:text-sm text-white/70">Measurable ROI & impact</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Sub-categories Modal */}
      <Dialog open={!!selectedIndustry} onOpenChange={(open) => !open && setSelectedIndustry(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto w-[95vw] rounded-xl">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4">
              {selectedIndustry && industryIcons[selectedIndustry.id] && (
                <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                  {(() => {
                    const Icon = industryIcons[selectedIndustry.id];
                    return <Icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />;
                  })()}
                </div>
              )}
              <div>
                <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900">
                  {selectedIndustry?.name}
                </DialogTitle>
                <DialogDescription className="text-sm md:text-base text-gray-600">
                  Specialized Training Areas
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="grid sm:grid-cols-2 gap-3">
              {selectedIndustry?.subCategories.map((sub, idx) => {
                const subSlug = sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <Link
                    key={idx}
                    to={`/industries/${selectedIndustry.id}/${subSlug}`}
                    onClick={() => setSelectedIndustry(null)}
                    className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg hover:bg-primary/5 active:bg-primary/10 transition-colors border border-transparent hover:border-primary/20 active:border-primary/30 group cursor-pointer touch-manipulation min-h-[44px]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0 group-hover:scale-150 group-active:scale-150 transition-transform" />
                    <span className="text-sm text-gray-700 font-medium leading-tight group-hover:text-primary group-active:text-primary transition-colors">
                      {sub.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
             <Button variant="outline" onClick={() => setSelectedIndustry(null)} className="w-full sm:w-auto">
               Close
             </Button>
             <Link to="/contact" onClick={() => setSelectedIndustry(null)} className="w-full sm:w-auto">
               <Button className="w-full">
                 Request Training in this Sector
               </Button>
             </Link>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}