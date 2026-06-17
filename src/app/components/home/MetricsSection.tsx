import { TrendingUp, Users, Award, Building2 } from 'lucide-react';

export default function MetricsSection() {
  const metrics = [
    {
      icon: Users,
      value: '150+',
      label: 'Professionals Trained',
      description: 'Across East Africa',
    },
    {
      icon: Building2,
      value: '10+',
      label: 'Corporate Clients',
      description: 'Trusted Partnerships',
    },
    {
      icon: Users,
      value: '150+',
      label: 'LMS Users',
      description: 'Active Learners',
    },
    {
      icon: TrendingUp,
      value: '25%',
      label: 'Average ROI Increase',
      description: 'Measured Outcomes',
    },
  ];

  return (
    <section className="py-10 md:py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #005A7C 0%, #004563 50%, #005A7C 100%)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Driving Results That Matter
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Our growing track record across East Africa speaks for itself. We deliver measurable impact for every client.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
            >
              <div className="bg-secondary w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <metric.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-5xl font-bold text-white mb-2">
                {metric.value}
              </div>
              <div className="text-xl font-semibold text-white mb-1">
                {metric.label}
              </div>
              <div className="text-white/70 text-sm">
                {metric.description}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <p className="text-white text-center text-lg">
            <strong>Professional Excellence:</strong> We maintain the highest standards of quality and professionalism. 
            Our experienced trainers and proven methodologies ensure your investment delivers tangible business results, 
            helping startups and established enterprises alike to thrive in the East African market.
          </p>
        </div>
      </div>
    </section>
  );
}