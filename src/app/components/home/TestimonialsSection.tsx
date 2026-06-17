import { Quote } from 'lucide-react';

const testimonials = [
  {
    company: 'ZEP-RE',
    role: 'Head of Finance',
    content: 'The in-house intermediate-advanced Excel training transformed our team\'s productivity. Our financial reporting time reduced by 40%, and the ROI was evident within the first quarter. Highly professional delivery.',
    program: 'In-House Excel Training',
  },
  {
    company: 'Soliton Telmec',
    role: 'Finance Manager',
    content: 'The Advanced Financial Modeling course exceeded our expectations. The practical approach and real-world scenarios helped us implement sophisticated financial models that improved our decision-making process significantly.',
    program: 'Advanced Financial Modeling',
  },
  {
    company: 'Tropic Air',
    role: 'Financial Controller',
    content: 'Kaizari LD International\'s training on Financial Modeling was exceptional. Our team now creates dynamic dashboards that give management instant visibility into our financial performance. The impact on our strategic planning has been remarkable.',
    program: 'Advanced Financial Modeling',
  },
  {
    company: 'OML Africa Logistics',
    role: 'CFO',
    content: 'The training delivered tangible results. Our forecasting accuracy improved by 35%, and we\'re now making data-driven decisions with confidence. The industry-leading trainers brought deep knowledge that made all the difference.',
    program: 'Advanced Financial Modeling',
  },
  {
    company: 'Qualibasic Seeds',
    role: 'Finance Director',
    content: 'Excellent training that combined theory with practical application. The skills we gained in Excel dashboarding have revolutionized how we present financial data to our board. Highly recommend Kaizari LD International.',
    program: 'Advanced Financial Modeling',
  },
  {
    company: 'PowerGroup Technologies',
    role: 'Senior Financial Analyst',
    content: 'Outstanding training program! The Advanced Financial Modeling course equipped our team with cutting-edge Excel skills. Our financial models are now more robust, and our analysis more insightful. Great ROI on this investment.',
    program: 'Advanced Financial Modeling',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-12 md:py-16 bg-white overflow-hidden" style={{ contentVisibility: 'auto' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Real feedback from organizations we've helped transform through training
          </p>
        </div>
      </div>

      {/* Scrolling Marquee */}
      <div className="relative flex overflow-x-hidden">
        {/* Gradient Overlays */}
        <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 md:gap-8 animate-marquee-slow py-4 will-change-transform">
          {/* First set */}
          {testimonials.map((testimonial, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[400px] bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="w-8 h-8 md:w-10 md:h-10 text-primary/20 mb-4" />
              <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                "{testimonial.content}"
              </p>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs md:text-sm text-gray-500 mb-1">{testimonial.role}</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <p className="text-sm md:text-base font-bold text-primary">{testimonial.company}</p>
                  <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-wider">{testimonial.program}</p>
                </div>
              </div>
            </div>
          ))}
          {/* Duplicate set for infinite scroll */}
          {testimonials.map((testimonial, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[400px] bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="w-8 h-8 md:w-10 md:h-10 text-primary/20 mb-4" />
              <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                "{testimonial.content}"
              </p>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs md:text-sm text-gray-500 mb-1">{testimonial.role}</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <p className="text-sm md:text-base font-bold text-primary">{testimonial.company}</p>
                  <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-wider">{testimonial.program}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-slow {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-slow {
          animation: marquee-slow 60s linear infinite;
        }
        @media (max-width: 768px) {
          .animate-marquee-slow {
            animation-duration: 40s;
          }
        }
        .animate-marquee-slow:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}