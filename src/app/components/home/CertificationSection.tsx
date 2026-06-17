import { Award, CheckCircle, Users, BookOpen, Star } from 'lucide-react';
import clientLogo from 'figma:asset/0b6ae337336e83091b49c86ad967e0194f344223.png';

export default function CertificationSection() {
  return (
    <section className="py-20 bg-white" style={{ contentVisibility: 'auto' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Trust Info */}
          <div className="space-y-6">
            <div className="inline-block">
              <div className="flex items-center gap-3 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/30">
                <Star className="w-5 h-5 text-secondary" />
                <span className="text-sm font-semibold text-secondary">Trusted Industry Leader</span>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Your Trusted Training Partner in East Africa
            </h2>

            <p className="text-base md:text-lg text-gray-600">
              Kaizari LD International is a premier corporate training provider delivering transformative learning solutions across East Africa. We empower organizations with skills that drive measurable business growth and innovation.
            </p>

            {/* Logo Display - Optimized for CLS */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 flex items-center justify-center aspect-[2/1] md:aspect-auto">
              <img
                src={clientLogo}
                alt="Kaizari LD International" 
                className="max-w-[200px] h-auto object-contain"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Proven Expertise</p>
                  <p className="text-sm text-gray-600">Industry-led training methodologies</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900">Practical Skills</p>
                  <p className="text-sm text-gray-600">Focus on real-world application</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - What We Bring to the Table */}
          <div className="rounded-2xl p-6 md:p-10 text-white shadow-xl" style={{ background: 'linear-gradient(135deg, #005A7C 0%, #004563 100%)' }}>
            <h3 className="text-2xl font-bold mb-6">
              Why Choose Kaizari?
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Excellence in Delivery</h4>
                  <p className="text-white/80 text-sm">
                    We adhere to the highest standards of professional training, ensuring every session delivers maximum value and engagement.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Cross-Industry Expertise</h4>
                  <p className="text-white/80 text-sm">
                    Proven training delivery across 8 major industries, from Agriculture to Finance, 
                    Technology to Manufacturing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Expert Practitioners</h4>
                  <p className="text-white/80 text-sm">
                    Our trainers are seasoned industry experts with deep practical experience and 
                    proven teaching capabilities.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <Monitor className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Modern LMS Platform</h4>
                  <p className="text-white/80 text-sm">
                    For clients seeking self-paced learning, our Learning Management System 
                    delivers flexible, accessible training anytime, anywhere.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <p className="text-sm text-white/90">
                <strong>Join our network:</strong> We're always looking for talented trainers 
                to join our expert panel. Visit our Partner Hub to apply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Monitor(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}