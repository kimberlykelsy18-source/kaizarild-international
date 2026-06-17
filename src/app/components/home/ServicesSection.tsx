import { BookOpen, Building2, TrendingUp, Users, Target, Award, Lightbulb, BarChart } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../ui/button';

const services = [
  {
    icon: BookOpen,
    title: 'Corporate Training (Open-House)',
    description: 'Join our scheduled public training events designed for professionals across all industries. Network with peers while gaining cutting-edge skills.',
    benefits: [
      'Cost-effective group learning',
      'Cross-industry networking opportunities',
      'Flexible scheduling with Q1-Q4 calendar',
      'NITA certified programs',
    ],
    cta: 'View Q1 Finance Events',
    link: '/open-course-events',
  },
  {
    icon: Building2,
    title: 'In-House Training',
    description: 'Customized training programs delivered at your premises, tailored to your organization\'s specific workflows, culture, and business objectives.',
    benefits: [
      'Customized content for your industry',
      'Higher ROI through team-wide implementation',
      'Improved productivity & efficiency',
      'Enhanced team collaboration & morale',
    ],
    cta: 'Request Custom Training',
    link: '/contact',
  },
  {
    icon: Lightbulb,
    title: 'Consulting Services',
    description: 'Strategic consulting to identify training needs, optimize workflows, and develop comprehensive learning strategies aligned with your business goals.',
    benefits: [
      'Expert business strategy consulting',
      'Training needs analysis & assessment',
      'Workflow optimization recommendations',
      'Long-term partnership & support',
    ],
    cta: 'Schedule Consultation',
    link: '/contact',
  },
];

const roiBenefits = [
  {
    icon: TrendingUp,
    title: 'Measurable ROI',
    description: 'Track tangible improvements in productivity, efficiency, and revenue generation',
  },
  {
    icon: Users,
    title: 'Enhanced Team Performance',
    description: 'Upskilled employees deliver better results and drive innovation',
  },
  {
    icon: Target,
    title: 'Competitive Advantage',
    description: 'Stay ahead of industry trends with cutting-edge knowledge and skills',
  },
  {
    icon: Award,
    title: 'Employee Retention',
    description: 'Investing in development increases satisfaction and reduces turnover',
  },
  {
    icon: BarChart,
    title: 'Operational Excellence',
    description: 'Streamlined processes and improved workflows across your organization',
  },
];

export default function ServicesSection() {
  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
            Our Services
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive training and consulting solutions designed to deliver measurable ROI 
            and transform your business performance across all industries.
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="bg-primary/10 w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center mb-5 md:mb-6 flex-shrink-0">
                <service.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
              </div>

              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>

              <p className="text-sm md:text-base text-gray-600 mb-6 flex-grow">
                {service.description}
              </p>

              <div className="space-y-2 mb-6">
                {service.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link to={service.link} className="mt-auto">
                <Button variant="outline" className="w-full">
                  {service.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* ROI & Benefits Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 md:p-12">
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Why Choose Kaizari LD International?
            </h3>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Our training programs deliver concrete business value with proven results
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {roiBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="bg-yellow-400/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}