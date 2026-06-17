import { Award, Users, Target, TrendingUp, Globe, BookOpen } from 'lucide-react';
import { Link } from 'react-router';

export default function AboutUs() {
  const services = [
    {
      icon: Users,
      title: 'Corporate Training (Open-House)',
      description: 'Public training events where professionals from different organizations come together to learn, network, and develop skills. Cost-effective and scheduled throughout the year.',
    },
    {
      icon: Target,
      title: 'In-House Training',
      description: 'Customized programs delivered at your premises, designed specifically for your industry, workflows, and business objectives. Maximum relevance and ROI.',
    },
    {
      icon: BookOpen,
      title: 'Consulting Services',
      description: 'Strategic consulting to identify training needs, optimize workflows, and develop comprehensive learning strategies aligned with your business goals.',
    },
  ];

  const values = [
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'High-impact programs delivered by expert trainers with proven industry experience.',
    },
    {
      icon: TrendingUp,
      title: 'Results-Driven',
      description: 'We focus on delivering measurable ROI and tangible business outcomes for every client.',
    },
    {
      icon: Globe,
      title: 'Professional Integrity',
      description: 'We maintain the highest standards of professionalism, transparency, and ethical practice.',
    },
    {
      icon: Users,
      title: 'Client-Centric',
      description: 'Your success is our success. We tailor every solution to your specific needs and challenges.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="text-white py-8 md:py-16 lg:py-20" style={{ background: 'linear-gradient(135deg, #005A7C 0%, #111827 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              About Kaizari LD International
            </h1>
            <p className="text-base md:text-xl text-white/80">
              Empowering businesses across all industries through strategic training and consulting solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Who We Are */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center mb-16 md:mb-24">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 uppercase tracking-tight">
              Who We Are
            </h2>
            <div className="space-y-4 text-sm md:text-lg text-gray-600 leading-relaxed">
              <p>
                Kaizari LD International is a premier training and consulting firm dedicated to 
                transforming businesses through strategic learning and development solutions. We serve 
                organizations across all industries, from Agriculture and Manufacturing to Finance, 
                Technology, Real Estate, and beyond.
              </p>
              <p>
                Our mission is to identify your organization's training needs and deliver customized programs 
                that enhance productivity, drive innovation, and deliver measurable ROI. Whether through our 
                open course events or tailored in-house training, we bring industry expertise and proven 
                methodologies to every engagement.
              </p>
              <p>
                As a growing leader in corporate training, we combine professional excellence with practical, 
                results-oriented approaches. Our commitment to quality ensures that every program meets national 
                standards for excellence, while our experienced trainers bring real-world industry knowledge.
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative aspect-[16/10] md:aspect-auto">
            <div className="absolute -inset-4 rounded-2xl blur-2xl opacity-10" style={{ background: 'linear-gradient(to right, #005A7C, #9333ea)' }} />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1655102718560-19dd4971f87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbnN1bHRpbmclMjBhZnJpY2F8ZW58MXx8fHwxNzY5MTA3ODMwfDA&ixlib=rb-4.1.0&q=80&w=800"
                alt="Professional Consulting"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* What We Do */}
        <div className="mb-16 md:mb-24" style={{ contentVisibility: 'auto' }}>
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
              What We Do for Companies
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive training and consulting solutions designed to drive business excellence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className="bg-primary/10 w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center mb-5 md:mb-6">
                  <service.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Approach */}
        <div className="bg-primary rounded-2xl p-6 md:p-12 text-white mb-16 md:mb-24" style={{ contentVisibility: 'auto' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-3xl font-bold mb-8 text-center uppercase tracking-tight">
              Our Approach: Identify, Design, Deliver
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <span className="text-xl md:text-2xl font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Identify Needs</h3>
                <p className="text-sm text-white/80">
                  Conduct thorough assessment of your organization's training requirements.
                </p>
              </div>
              <div className="text-center border-t border-white/10 pt-8 md:border-0 md:pt-0">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <span className="text-xl md:text-2xl font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Design Solutions</h3>
                <p className="text-sm text-white/80">
                  Develop customized training programs that address your specific needs.
                </p>
              </div>
              <div className="text-center border-t border-white/10 pt-8 md:border-0 md:pt-0">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <span className="text-xl md:text-2xl font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Deliver Results</h3>
                <p className="text-sm text-white/80">
                  Execute training with expert facilitators and measure tangible ROI.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div style={{ contentVisibility: 'auto' }}>
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
              Our Values
            </h2>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary/50 hover:shadow-lg transition-all text-center"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {value.title}
                </h4>
                <p className="text-xs md:text-sm text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 md:mt-24 rounded-3xl p-8 md:p-12 text-center shadow-xl" style={{ background: 'linear-gradient(to right, #F57C00, #ea580c)' }}>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h3>
          <p className="text-sm md:text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Let's discuss how Kaizari LD International can help your organization achieve its training 
            and development goals.
          </p>
          <Link to="/contact">
            <button className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg active:scale-95">
              Get in Touch
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}