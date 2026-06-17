import { Link } from 'react-router';
import { Button } from '../ui/button';
import { Monitor, BookOpen, Award, Users, BarChart, Clock } from 'lucide-react';

export default function LMSSection() {
  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Content',
      description: 'Access to extensive training materials and resources',
    },
    {
      icon: Users,
      title: 'Interactive Learning',
      description: 'Engage with trainers and peers in real-time',
    },
    {
      icon: BarChart,
      title: 'Track Progress',
      description: 'Monitor individual and team learning outcomes',
    },
    {
      icon: Award,
      title: 'Certifications',
      description: 'Earn professionally-recognized certificates upon completion',
    },
    {
      icon: Clock,
      title: 'Flexible Learning',
      description: 'Learn at your own pace, anytime, anywhere',
    },
    {
      icon: Monitor,
      title: 'Modern Platform',
      description: 'Intuitive, user-friendly learning environment',
    },
  ];

  return (
    <section className="py-12 md:py-20" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }} contentVisibility="auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="order-2 lg:order-1">
            <div className="relative aspect-[4/3] w-full">
              <div className="absolute -inset-4 rounded-2xl blur-2xl opacity-10" style={{ background: 'linear-gradient(to right, #005A7C, #9333ea)' }} />
              <div className="relative rounded-2xl shadow-2xl overflow-hidden w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1739303987830-ca19742b19bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGJ1c2luZXNzJTIwdGVhbSUyMGNvbGxhYm9yYXRpb258ZW58MXx8fHwxNzY5MTA3ODMwfDA&ixlib=rb-4.1.0&q=80&w=800"
                  alt="Learning Management System"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-secondary rounded-xl p-4 md:p-6 shadow-xl hidden sm:block z-20">
                <p className="text-2xl md:text-3xl font-bold text-white">LMS</p>
                <p className="text-xs md:text-sm text-white/90">Available Now</p>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="inline-block">
              <span className="bg-primary/10 text-primary px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold border border-primary/20">
                Learning Management System
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
              Experience Our Cutting-Edge LMS Platform
            </h2>

            <p className="text-sm md:text-lg text-gray-600">
              Take your team's learning to the next level with our state-of-the-art Learning Management System. 
              Designed for modern businesses, our LMS provides a seamless, engaging learning experience that 
              drives real results.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:border-primary/20 transition-colors">
                  <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-6 text-white shadow-lg" style={{ background: 'linear-gradient(to right, #005A7C, #111827)' }}>
              <h3 className="text-lg md:text-xl font-bold mb-2">
                Ready to Transform Your Training?
              </h3>
              <p className="text-sm md:text-base text-white/80 mb-4">
                Book a personalized demo to see how our LMS can revolutionize your organization's 
                learning and development strategy.
              </p>
              <Link to="/lms-demo" className="block w-full sm:w-auto">
                <Button size="lg" className="bg-secondary text-white hover:bg-secondary/90 w-full sm:w-auto border-0">
                  Schedule Your Free Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}