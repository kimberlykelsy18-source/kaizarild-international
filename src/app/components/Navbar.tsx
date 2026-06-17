import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Menu, X, ChevronDown, ChevronUp, ChevronRight, FileText, Briefcase, Users, Building2, Phone } from 'lucide-react';
import { Button } from './ui/button';
import IndustriesMegaMenu from './IndustriesMegaMenu';
import ResourcesDropdown from './ResourcesDropdown';
import CompanyDropdown from './CompanyDropdown';
import logoGold from 'figma:asset/0b6ae337336e83091b49c86ad967e0194f344223.png';
import { industries } from '../data/industries';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [mobileActiveIndustry, setMobileActiveIndustry] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md h-14 md:h-16' : 'shadow-sm h-16 md:h-20'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 relative">
            <img 
              src={logoGold}
              alt="Kaizari LD International" 
              className="h-8 md:h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors font-medium text-sm xl:text-base">
              Home
            </Link>

            <IndustriesMegaMenu />
            
            <Link to="/open-course-events" className="text-gray-700 hover:text-primary transition-colors font-medium text-sm xl:text-base">
              Events
            </Link>

            <ResourcesDropdown />

            <CompanyDropdown />

            <Link to="/lms-demo">
              <Button size="sm" className="bg-secondary text-white hover:bg-secondary/90 transition-all hover:scale-105 px-3 xl:px-5 text-sm">
                LMS Demo
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation - Optimized */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-14 md:top-16 bg-white border-b border-gray-200 shadow-xl max-h-[calc(100vh-3.5rem)] md:max-h-[calc(100vh-4rem)] overflow-y-auto z-40">
            <div className="px-3 py-4 space-y-1">
              <Link 
                to="/" 
                className="block px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-lg transition-colors" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              {/* Industries Accordion - Mobile */}
              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={() => setMobileIndustriesOpen(!mobileIndustriesOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span>Solutions</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileIndustriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {mobileIndustriesOpen && (
                  <div className="mt-1 ml-2 space-y-1 max-h-[50vh] overflow-y-auto">
                    {industries.map((industry) => (
                      <div key={industry.id}>
                        <button
                          onClick={() => setMobileActiveIndustry(mobileActiveIndustry === industry.id ? null : industry.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                            mobileActiveIndustry === industry.id 
                              ? 'bg-primary text-white' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span>{industry.name}</span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileActiveIndustry === industry.id ? 'rotate-90' : ''}`} />
                        </button>
                        
                        {mobileActiveIndustry === industry.id && (
                          <div className="ml-3 mt-1 space-y-0.5 bg-gray-50 rounded-lg p-2">
                            {industry.subCategories.map((subCategory, idx) => {
                              const slug = subCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                              return (
                                <Link
                                  key={idx}
                                  to={`/industries/${industry.id}/${slug}`}
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setMobileIndustriesOpen(false);
                                    setMobileActiveIndustry(null);
                                  }}
                                  className="block px-3 py-2 text-xs text-gray-700 hover:text-primary hover:bg-white rounded-md transition-colors"
                                >
                                  {subCategory.name}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                to="/open-course-events" 
                className="block px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-lg transition-colors" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              
              {/* Resources Accordion - Mobile */}
              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span>Resources</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {mobileResourcesOpen && (
                  <div className="mt-1 ml-3 space-y-0.5">
                    <Link 
                      to="/case-studies" 
                      className="block px-3 py-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Case Studies
                    </Link>
                    <Link 
                      to="/blog" 
                      className="block px-3 py-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Blog
                    </Link>
                  </div>
                )}
              </div>

              {/* Company Accordion - Mobile */}
              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={() => setMobileCompanyOpen(!mobileCompanyOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span>Company</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileCompanyOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {mobileCompanyOpen && (
                  <div className="mt-1 ml-3 space-y-0.5">
                    <Link 
                      to="/about" 
                      className="block px-3 py-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link 
                      to="/partner-hub" 
                      className="block px-3 py-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Partner Hub
                    </Link>
                    <Link 
                      to="/contact" 
                      className="block px-3 py-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contact Us
                    </Link>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100">
                <Link to="/lms-demo" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-secondary text-white hover:bg-secondary/90 h-11">
                    Book LMS Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}