import { Link } from 'react-router';
import { Button } from '../ui/button';
import { ArrowRight, Calendar, Users } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-12 md:py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #005A7C 0%, #004563 50%, #005A7C 100%)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
            Join leading organizations across all industries who trust Kaizari LD International 
            for their training and development needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Open Course Events CTA */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all">
            <div className="bg-yellow-400 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6 md:w-7 md:h-7 text-gray-900" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
              Q1 Finance Courses
            </h3>
            <p className="text-sm md:text-base text-white/80 mb-6">
              Join our Advanced Financial Modeling & Dashboards with Excel training 
              (March 17-19, 2026). Limited seats available!
            </p>
            <Link to="/open-course-events">
              <Button size="lg" className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 group text-base">
                View Course Schedule
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* In-House Training CTA */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all">
            <div className="bg-yellow-400 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-gray-900" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
              Custom In-House Training
            </h3>
            <p className="text-sm md:text-base text-white/80 mb-6">
              Need training tailored to your organization's specific needs? 
              Let's design a customized program that delivers measurable ROI.
            </p>
            <Link to="/contact">
              <Button size="lg" className="w-full bg-white text-primary hover:bg-gray-100 font-semibold group text-base">
                Request a Consultation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/60 text-xs md:text-sm">
            Questions? Contact us at{' '}
            <a href="mailto:admin@kaizarildinternational.com" className="text-yellow-400 hover:underline">
              admin@kaizarildinternational.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}