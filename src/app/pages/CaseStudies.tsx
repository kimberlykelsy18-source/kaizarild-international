import { useState, useEffect } from 'react';
import { TrendingUp, Users, Target, Award, ArrowRight } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d`;

// Icon mapping for displaying outcomes
const getIconForOutcome = (metric: string) => {
  const metricLower = metric.toLowerCase();
  if (metricLower.includes('%') || metricLower.includes('reduction') || metricLower.includes('improvement')) {
    return TrendingUp;
  }
  if (metricLower.includes('roi') || metricLower.includes('award')) {
    return Award;
  }
  if (metricLower.includes('participant') || metricLower.includes('professional') || metricLower.includes('team')) {
    return Users;
  }
  return Target;
};

interface CaseStudyOutcome {
  metric: string;
  description: string;
}

interface CaseStudyTestimonial {
  quote: string;
  role: string;
}

interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  participants?: string;
  program: string;
  challenge: string;
  challengeDetails: string;
  solution: string;
  solutionDetails: string;
  outcomes: CaseStudyOutcome[];
  impact: string;
  testimonial: CaseStudyTestimonial;
  published: boolean;
}

export default function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const response = await fetch(`${API_BASE}/case-studies/published`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch case studies');
      
      const data = await response.json();
      setCaseStudies(data);
    } catch (error) {
      console.error('Error fetching case studies:', error);
      toast.error('Failed to load case studies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="text-white py-12 md:py-16" style={{ background: 'linear-gradient(135deg, #005A7C 0%, #004563 50%, #005A7C 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">
              Case Studies
            </h1>
            <p className="text-xl text-white/80">
              Real results from organizations we've helped transform through strategic training. 
              See how our programs deliver measurable ROI and business impact.
            </p>
          </div>
        </div>
      </div>

      {/* Case Studies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading case studies...</p>
          </div>
        ) : caseStudies.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-gray-200">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Case Studies Available</h3>
            <p className="text-gray-600 mb-6">We're currently updating our case studies. Please check back later.</p>
            <a href="/contact">
              <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Contact Us
              </button>
            </a>
          </div>
        ) : (
          caseStudies.map((study) => (
            <div key={study.id}>
              {/* Header */}
              <div className="mb-8">
                <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  {study.industry}
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  {study.client}
                </h2>
                {study.participants && (
                  <p className="text-gray-600 text-lg">
                    Participating Organizations: {study.participants}
                  </p>
                )}
                <p className="text-lg text-primary font-semibold mt-2">
                  {study.program}
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                {/* Challenge */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 font-bold">1</span>
                      </div>
                      {study.challenge}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {study.challengeDetails}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                      {study.solution}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {study.solutionDetails}
                    </p>
                  </div>
                </div>

                {/* Results & Impact */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 font-bold">3</span>
                      </div>
                      Measurable Results
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {study.outcomes.map((outcome, index) => {
                        const Icon = getIconForOutcome(outcome.metric);
                        return (
                          <div
                            key={index}
                            className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200"
                          >
                            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                              {outcome.metric}
                            </div>
                            <p className="text-sm text-gray-600">
                              {outcome.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-primary rounded-xl p-6 text-white">
                    <h4 className="font-semibold mb-3">Business Impact</h4>
                    <p className="text-white/90 leading-relaxed">
                      {study.impact}
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="mt-8 rounded-2xl p-8 border" style={{ background: 'linear-gradient(135deg, rgba(245, 124, 0, 0.1) 0%, rgba(245, 124, 0, 0.05) 100%)', borderColor: 'rgba(245, 124, 0, 0.3)' }}>
                <div className="flex items-start gap-4">
                  <div className="text-6xl text-secondary/30 leading-none">"</div>
                  <div className="flex-1">
                    <p className="text-lg text-gray-700 mb-4 italic">
                      {study.testimonial.quote}
                    </p>
                    <p className="text-sm text-gray-600 font-semibold">{study.testimonial.role}</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              {study.id !== caseStudies.length && (
                <div className="mt-20 border-t border-gray-200" />
              )}
            </div>
          ))
        )}
      </div>

      {/* CTA Section */}
      <div className="py-16" style={{ background: 'linear-gradient(to right, #005A7C 0%, #004563 50%, #005A7C 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Achieve Similar Results?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Let's discuss how our training programs can deliver measurable ROI for your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/open-course-events">
              <button className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors flex items-center gap-2">
                View Open Courses
                <ArrowRight className="w-5 h-5" />
              </button>
            </a>
            <a href="/contact">
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
                Request In-House Training
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}