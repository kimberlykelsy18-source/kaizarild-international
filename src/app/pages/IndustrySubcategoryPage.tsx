import { useParams, Link } from 'react-router';
import { ArrowRight, Phone, CheckCircle, Building2, TrendingUp, Users, Award, BookOpen, Target, Clock, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { industries } from '../data/industries';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SubcategoryContent {
  industryId: string;
  subcategorySlug: string;
  subcategoryName: string;
  heroHeadline: string;
  heroDescription: string;
  heroImage?: string;
  overview: string;
  keyBenefits: Array<{ title: string; description: string; icon: string }>;
  trainingModules: Array<{ title: string; description: string; duration?: string }>;
  outcomes: string[];
  testimonial?: {
    quote: string;
    author: string;
    position: string;
    company: string;
  };
  faqs: Array<{ question: string; answer: string }>;
}

export default function IndustrySubcategoryPage() {
  const { industryId, subcategorySlug } = useParams();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [customContent, setCustomContent] = useState<SubcategoryContent | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Find the industry
  const industry = industries.find(ind => ind.id === industryId);

  // Decode the subcategory slug
  const subcategoryName = subcategorySlug ? decodeURIComponent(subcategorySlug) : '';

  // Load content from API
  useEffect(() => {
    const loadContent = async () => {
      if (!industryId || !subcategorySlug) return;
      
      setLoading(true);
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d/subcategories/${industryId}/${subcategorySlug}`,
          {
            headers: { 'Authorization': `Bearer ${publicAnonKey}` }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setCustomContent(data);
        } else {
          setCustomContent(null);
        }
      } catch (error) {
        console.error('Error loading content:', error);
        setCustomContent(null);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [industryId, subcategorySlug]);

  if (!industry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Industry Not Found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Find the subcategory
  const subcategory = industry.subCategories.find(
    sub => sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === subcategoryName
  );

  if (!subcategory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Subcategory Not Found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleContactClick = () => {
    const message = `Hello! I'm interested in training solutions for ${subcategory.name} in the ${industry.name} industry. Can we discuss customized options?`;
    window.open(`https://wa.me/254713955653?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmailContact = () => {
    const subject = `Training Inquiry: ${subcategory.name}`;
    const body = `Hello,\n\nI'm interested in learning more about your ${subcategory.name} training programs in the ${industry.name} sector.\n\nPlease contact me to discuss:\n- Course details and curriculum\n- Customization options\n- Pricing and schedules\n- In-house training possibilities\n\nThank you!`;
    window.location.href = `mailto:admin@kaizarildinternational.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Loading State */}
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Empty State - No Content Yet */}
      {!loading && !customContent && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-2xl text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {subcategory.name}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Training content for this course is currently being developed.
              </p>
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-6 mb-8">
                <p className="text-gray-700 mb-4">
                  <strong>Looking for customized training?</strong> We can create a tailored program for your organization in {subcategory.name.toLowerCase()}.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleContactClick}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    Request In-House Training
                  </button>
                  <button
                    onClick={handleEmailContact}
                    className="bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    Email Us
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <Link to="/" className="text-primary hover:underline font-semibold">
                  ← Return to Homepage
                </Link>
                {' • '}
                <Link to="/open-course-events" className="text-primary hover:underline font-semibold">
                  View Open Course Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Content Exists - Display Full Page */}
      {!loading && customContent && (
        <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary to-secondary text-white py-10 md:py-16 lg:py-20 relative overflow-hidden">
        {/* Hero Background Image */}
        {customContent?.heroImage && (
          <div className="absolute inset-0 z-0">
            <img 
              src={customContent.heroImage} 
              alt={subcategory.name}
              className="w-full h-full object-cover opacity-50"
              onError={(e) => {
                // Hide image if it fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/60 to-secondary/70"></div>
          </div>
        )}
        
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold mb-4 md:mb-6 uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              {industry.name} • In-House Training Available
            </div>
            
            {/* Coming Soon Badge - Only show if overview contains "coming soon" */}
            {customContent?.overview?.toLowerCase().includes('coming soon') && (
              <div className="inline-flex items-center gap-2 bg-secondary/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm md:text-base font-bold mb-4 uppercase tracking-wider animate-pulse shadow-lg">
                <Clock className="w-5 h-5" />
                Detailed Content Coming Soon
              </div>
            )}
            
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              {customContent?.heroHeadline || subcategory.name}
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-white/95 leading-relaxed mb-6 md:mb-8">
              {customContent?.heroDescription || `Professional training and development solutions tailored for ${subcategory.name.toLowerCase()} organizations. Transform your team's capabilities with our industry-focused programs.`}
            </p>
            
            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <button
                onClick={handleContactClick}
                className="bg-secondary hover:bg-secondary/90 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
                Request In-House Training
              </button>
              <button
                onClick={handleEmailContact}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2"
              >
                Get Course Details
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        
        {/* Overview Section */}
        {customContent?.overview && (
          <div className="mb-12 md:mb-16">
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 md:p-8 lg:p-10">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">{customContent.overview}</p>
            </div>
          </div>
        )}

        {/* Key Benefits */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 md:mb-8 text-center">Why Choose This Program?</h2>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {(customContent?.keyBenefits || [
              {
                title: 'Industry-Specific',
                description: `Training programs designed specifically for ${subcategory.name.toLowerCase()} challenges and opportunities in ${industry.name.toLowerCase()}.`,
                icon: 'building'
              },
              {
                title: 'Measurable Results',
                description: 'Our clients report up to 40% improvement in operational efficiency and team performance after completing our programs.',
                icon: 'trending'
              },
              {
                title: 'Expert Trainers',
                description: `Learn from industry experts with real-world experience and proven track records in ${industry.name.toLowerCase()}.`,
                icon: 'users'
              }
            ]).map((benefit, index) => {
              const IconComponent = benefit.icon === 'building' ? Building2 : 
                                   benefit.icon === 'trending' ? TrendingUp :
                                   benefit.icon === 'award' ? Award :
                                   benefit.icon === 'target' ? Target :
                                   Users;
              
              return (
                <div key={index} className="bg-white border-2 border-gray-100 hover:border-primary/30 p-6 md:p-8 rounded-xl transition-all hover:shadow-lg group">
                  <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Training Modules */}
        {customContent?.trainingModules && customContent.trainingModules.length > 0 && (
          <div className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 md:mb-8 text-center">Training Modules</h2>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {customContent.trainingModules.map((module, index) => (
                <div key={index} className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 p-6 rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-gray-900">{module.title}</h3>
                    </div>
                    {module.duration && (
                      <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600 bg-white px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        {module.duration}
                      </div>
                    )}
                  </div>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed ml-11">{module.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Outcomes */}
        <div className="mb-12 md:mb-16 bg-gray-50 p-6 md:p-10 lg:p-12 rounded-2xl">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="bg-primary w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">What You'll Learn</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {(customContent?.outcomes || [
              'Leadership and Management Development',
              'Technical Skills Training',
              'Compliance and Regulatory Training',
              'Customer Service Excellence',
              'Financial Management and Reporting',
              'Data Analysis and Business Intelligence',
              'Digital Transformation Strategies',
              'Team Building and Communication',
              'Process Improvement and Efficiency',
              'Strategic Planning and Execution',
            ]).map((outcome, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm md:text-base text-gray-700 font-medium">{outcome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        {customContent?.testimonial && (
          <div className="mb-12 md:mb-16">
            <div className="bg-gradient-to-br from-secondary to-primary text-white rounded-2xl p-6 md:p-10 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-white/10 text-9xl font-bold">"</div>
              <div className="relative z-10">
                <p className="text-lg md:text-xl lg:text-2xl font-medium mb-6 leading-relaxed italic">
                  "{customContent.testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <div>
                    <div className="font-bold text-base md:text-lg">{customContent.testimonial.author}</div>
                    <div className="text-sm md:text-base text-white/90">{customContent.testimonial.position}</div>
                    <div className="text-xs md:text-sm text-white/75">{customContent.testimonial.company}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQs */}
        {customContent?.faqs && customContent.faqs.length > 0 && (
          <div className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 md:mb-8 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {customContent.faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-base md:text-lg text-gray-900 pr-4">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-5 md:px-6 pb-5 md:pb-6 text-sm md:text-base text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-6 md:p-10 lg:p-12 mb-12 md:mb-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Award className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div className="inline-block bg-secondary/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-4">
              ✓ In-House Training Available
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              Ready to Transform Your Team?
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-white/95 mb-6 md:mb-8 leading-relaxed">
              This program is available exclusively as customized in-house training. We'll tailor the curriculum to your organization's specific needs in {subcategory.name.toLowerCase()}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleContactClick}
                className="bg-secondary hover:bg-secondary/90 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
                Request In-House Training
              </button>
              <button
                onClick={handleEmailContact}
                className="bg-white text-primary hover:bg-white/95 px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                Email Us
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
            <div className="mt-6 md:mt-8 pt-6 border-t border-white/20">
              <p className="text-white/80 text-sm md:text-base">
                Looking for public courses? <Link to="/open-course-events" className="text-white font-semibold underline hover:no-underline">Check our Q1 Finance Open Course Events</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Related Training Areas */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Explore Related Training in {industry.name}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {industry.subCategories
              .filter(sub => sub.name !== subcategory.name)
              .slice(0, 6)
              .map((sub, index) => {
                const subSlug = sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return (
                  <Link
                    key={index}
                    to={`/industries/${industryId}/${subSlug}`}
                    className="bg-white border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all p-5 md:p-6 rounded-xl group"
                  >
                    <h3 className="font-bold text-base md:text-lg text-gray-900 group-hover:text-primary transition-colors mb-2">
                      {sub.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600">Specialized training solutions</p>
                    <ArrowRight className="w-4 h-4 mt-2 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}