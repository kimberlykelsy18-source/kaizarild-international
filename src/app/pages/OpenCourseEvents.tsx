import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, ArrowRight, Phone, Zap, Monitor, Play, Globe, FileText, X, Building2, User, Plus, Minus, Send, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d`;
const WHATSAPP_NUMBER = '254713955653';

interface Event {
  id: string;
  title: string;
  dates: string;
  duration: string;
  time: string;
  location: string;
  capacity: string;
  seatsRemaining: number | null;
  category: string;
  featured: boolean;
  description: string;
  outcomes: string[];
  whoShouldAttend: string[];
  paymentLink: string;
  brochureUrl: string;
  benefits: string[];
  published: boolean;
}

interface Participant {
  name: string;
  email: string;
  jobTitle: string;
}

interface CompanyFormData {
  companyName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  participants: Participant[];
  additionalNotes: string;
}

const emptyParticipant = (): Participant => ({ name: '', email: '', jobTitle: '' });

export default function OpenCourseEvents() {
  const [courses, setCourses] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Sponsorship modal state
  const [selectedCourse, setSelectedCourse] = useState<Event | null>(null);
  const [modalStep, setModalStep] = useState<'select' | 'company-form'>('select');
  const [companyForm, setCompanyForm] = useState<CompanyFormData>({
    companyName: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    participants: [emptyParticipant()],
    additionalNotes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE}/events/published`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      if (!response.ok) throw new Error('Failed to fetch events');
      const events = await response.json();
      setCourses(Array.isArray(events) ? events : []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const openSponsorModal = (course: Event) => {
    setSelectedCourse(course);
    setModalStep('select');
    setCompanyForm({
      companyName: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      participants: [emptyParticipant()],
      additionalNotes: '',
    });
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setModalStep('select');
  };

  const handleSelfSponsored = () => {
    if (selectedCourse?.paymentLink) {
      window.open(selectedCourse.paymentLink, '_blank');
    } else {
      toast.info('Payment link not available yet. Please contact us.');
    }
    closeModal();
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    setCompanyForm(prev => {
      const updated = [...prev.participants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, participants: updated };
    });
  };

  const addParticipant = () => {
    setCompanyForm(prev => ({ ...prev, participants: [...prev.participants, emptyParticipant()] }));
  };

  const removeParticipant = (index: number) => {
    if (companyForm.participants.length === 1) return;
    setCompanyForm(prev => ({ ...prev, participants: prev.participants.filter((_, i) => i !== index) }));
  };

  const handleCompanySubmit = () => {
    // Validate required fields
    if (!companyForm.companyName.trim() || !companyForm.contactPerson.trim() || !companyForm.contactPhone.trim()) {
      toast.error('Please fill in all required company details.');
      return;
    }
    const hasEmptyParticipant = companyForm.participants.some(p => !p.name.trim());
    if (hasEmptyParticipant) {
      toast.error('Please enter a name for each participant.');
      return;
    }

    setSubmitting(true);
    const course = selectedCourse!;

    const participantLines = companyForm.participants
      .map((p, i) => `${i + 1}. ${p.name}${p.jobTitle ? ` (${p.jobTitle})` : ''}${p.email ? ` | ${p.email}` : ''}`)
      .join('\n');

    const message = [
      `*COMPANY SPONSORSHIP REQUEST — KAIZARI L&D*`,
      ``,
      `*Course:* ${course.title}`,
      `*Dates:* ${course.dates}`,
      `*Location:* ${course.location}`,
      ``,
      `*COMPANY DETAILS*`,
      `Company: ${companyForm.companyName}`,
      `Contact Person: ${companyForm.contactPerson}`,
      companyForm.contactEmail ? `Email: ${companyForm.contactEmail}` : null,
      `Phone: ${companyForm.contactPhone}`,
      ``,
      `*PARTICIPANTS (${companyForm.participants.length})*`,
      participantLines,
      companyForm.additionalNotes.trim() ? `\n*Additional Notes:*\n${companyForm.additionalNotes}` : null,
    ]
      .filter(line => line !== null)
      .join('\n');

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    setSubmitting(false);
    toast.success('WhatsApp opened! Our sales team will get back to you shortly.');
    closeModal();
  };

  const handleContactClick = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const message = `Hello! I'm interested in the "${course.title}" course scheduled for ${course.dates}. Can I get more information?`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="text-white py-8 md:py-16 lg:py-20" style={{ background: 'linear-gradient(135deg, #005A7C 0%, #004563 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-block bg-secondary text-white px-4 py-2 rounded-full text-xs font-bold mb-4 md:mb-6 uppercase tracking-wider">
              2026 Events
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              Open Course Events
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Join our public training events and network with professionals while gaining cutting-edge skills.
              Open courses and customized in-house training available.
            </p>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading events...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-gray-200">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Events Available</h3>
            <p className="text-gray-600 mb-6">There are no published events at the moment. Please check back later.</p>
            <Link to="/contact">
              <Button>Contact Us for Training</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-12 md:space-y-16">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Featured Badge */}
                {course.featured && course.seatsRemaining && (
                  <div className="text-white px-6 py-3" style={{ background: 'linear-gradient(to right, #dc2626, #ea580c)' }}>
                    <div className="flex items-center justify-center gap-3 text-sm md:text-base font-bold">
                      <Zap className="w-5 h-5" />
                      <span>FILLING FAST - Only {course.seatsRemaining} Seats Left!</span>
                      <Zap className="w-5 h-5" />
                    </div>
                  </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8 p-6 md:p-10">
                  {/* Course Details */}
                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {course.title}
                      </h2>
                      <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Course Info Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Date */}
                      <button
                        onClick={() => openSponsorModal(course)}
                        className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all duration-200 cursor-pointer group text-left"
                      >
                        <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                          <Calendar className="w-5 h-5 text-primary group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Dates</p>
                          <p className="font-bold text-gray-900">{course.dates}</p>
                          <p className="text-xs text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to register</p>
                        </div>
                      </button>

                      {/* Duration & Time */}
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
                        <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Duration & Time</p>
                          <p className="font-bold text-gray-900">{course.duration}</p>
                          {course.time && <p className="text-sm text-gray-600 mt-1">{course.time}</p>}
                        </div>
                      </div>

                      {/* Location */}
                      <button
                        onClick={() => handleContactClick(course.id)}
                        className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all duration-200 cursor-pointer group text-left"
                      >
                        <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0 group-hover:bg-primary transition-all">
                          <MapPin className="w-5 h-5 text-primary group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Location</p>
                          <p className="font-bold text-gray-900">{course.location}</p>
                          <p className="text-xs text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click for details</p>
                        </div>
                      </button>

                      {/* Capacity */}
                      <button
                        onClick={() => openSponsorModal(course)}
                        className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all duration-200 cursor-pointer group text-left"
                      >
                        <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0 group-hover:bg-primary transition-all">
                          <Users className="w-5 h-5 text-primary group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Capacity</p>
                          <p className="font-bold text-gray-900">{course.capacity}</p>
                          {course.seatsRemaining && (
                            <p className="text-xs text-red-600 font-bold mt-1">{course.seatsRemaining} seats left!</p>
                          )}
                          <p className="text-xs text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Reserve your spot</p>
                        </div>
                      </button>
                    </div>

                    {/* Learning Outcomes */}
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 uppercase tracking-tight">
                        What You'll Learn
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.outcomes.map((outcome, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm md:text-base text-gray-700 leading-relaxed">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Who Should Attend */}
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
                        Who Should Attend
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {course.whoShouldAttend.map((audience, index) => (
                          <span key={index} className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary hover:text-white transition-colors cursor-default">
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Brochure View */}
                    {course.brochureUrl && (
                      <div className="border-2 border-dashed border-primary/30 rounded-xl p-5 bg-primary/3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">Course Brochure</p>
                            <p className="text-sm text-gray-600">View the full brochure for detailed course information</p>
                          </div>
                        </div>
                        <a
                          href={course.brochureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-semibold transition-all text-sm"
                        >
                          <FileText className="w-4 h-4" />
                          View Brochure
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Registration CTA */}
                  <div className="lg:col-span-1">
                    <div className="rounded-xl p-8 text-white sticky top-24 space-y-6" style={{ background: 'linear-gradient(135deg, #005A7C 0%, #004563 100%)' }}>
                      {course.seatsRemaining && (
                        <div className="bg-red-600 text-white px-4 py-3 rounded-lg text-center font-bold animate-pulse">
                          Only {course.seatsRemaining} Seats Left!
                        </div>
                      )}

                      <h3 className="text-2xl font-bold">Join this Course</h3>

                      {course.benefits && course.benefits.length > 0 && (
                        <div className="space-y-3">
                          {course.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 flex-shrink-0" />
                              <span className="text-sm">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-3">
                        <Button
                          onClick={() => openSponsorModal(course)}
                          className="w-full bg-secondary hover:bg-secondary/90 text-white text-lg py-6 font-bold shadow-lg hover:shadow-xl transition-all"
                        >
                          <ArrowRight className="mr-2 w-5 h-5" />
                          Register
                        </Button>

                        {course.brochureUrl && (
                          <a
                            href={course.brochureUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                          >
                            <FileText className="w-4 h-4" />
                            View Brochure
                          </a>
                        )}

                        <button
                          onClick={() => handleContactClick(course.id)}
                          className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Contact Us
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Virtual Training Option - LMS Platform */}
        <div className="mt-24 border-2 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0, 90, 124, 0.05) 0%, rgba(59, 130, 246, 0.1) 100%)', borderColor: 'rgba(0, 90, 124, 0.2)' }}>
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Side - Information */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold mb-6 uppercase tracking-wider w-fit">
                Flexible Learning
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Can't Attend In-Person? <br />Train Virtually on Our LMS
              </h2>
              <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed">
                If you're unable to attend our open courses in Nairobi, all training programs are available virtually through our advanced Learning Management System (LMS). Learn at your own pace with the same quality content and expert support.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                    <Monitor className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Interactive Online Platform</h3>
                    <p className="text-gray-600 text-sm">Access courses anywhere, anytime with our user-friendly LMS interface</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                    <Play className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Video Lessons & Resources</h3>
                    <p className="text-gray-600 text-sm">High-quality video content, downloadable materials, and practical exercises</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Global Accessibility</h3>
                    <p className="text-gray-600 text-sm">Perfect for remote teams, international learners, and busy professionals</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - CTA */}
            <div className="p-8 md:p-12 flex flex-col justify-center text-white" style={{ background: 'linear-gradient(135deg, #005A7C 0%, #004563 100%)' }}>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Explore Our LMS Platform</h3>
              <p className="text-white/90 mb-6 leading-relaxed">
                Experience the future of corporate training. Book a free demo to see how our LMS can transform your team's learning journey.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Same curriculum as in-person courses</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Track progress and performance</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Certificate upon completion</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Instructor support available</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link to="/lms-demo">
                  <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-white text-lg py-6 font-bold shadow-lg hover:shadow-xl transition-all">
                    <Monitor className="mr-2 w-5 h-5" />
                    Book Free LMS Demo
                  </Button>
                </Link>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I'm interested in virtual training on your LMS platform. Can you provide more information?")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Ask About Virtual Training
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* In-House Training CTA */}
        <div className="mt-16 border-2 rounded-2xl p-8 md:p-12 text-center" style={{ background: 'linear-gradient(135deg, rgba(245, 124, 0, 0.1) 0%, rgba(245, 124, 0, 0.05) 100%)', borderColor: 'rgba(245, 124, 0, 0.3)' }}>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Need Customized In-House Training?
          </h3>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            All our courses are available as customized in-house training programs tailored to your organization's specific needs.
            We serve 8+ industries with flexible training solutions.
          </p>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I'm interested in customized in-house training.")}`} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white text-lg py-6 px-8 font-bold shadow-lg hover:shadow-xl transition-all">
              <Phone className="mr-2 w-5 h-5" />
              Request In-House Training
            </Button>
          </a>
        </div>
      </div>

      {/* ===== SPONSORSHIP MODAL ===== */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {modalStep === 'select' ? 'How will you be paying?' : 'Company Sponsorship Details'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5 leading-snug">{selectedCourse.title}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Step 1: Sponsorship Selection */}
            {modalStep === 'select' && (
              <div className="p-6 space-y-4">
                <p className="text-gray-600 text-sm">
                  Select how you'll be funding this training to proceed with the right registration process.
                </p>

                {/* Self-Sponsored Option */}
                <button
                  onClick={handleSelfSponsored}
                  className="w-full text-left p-5 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/3 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors flex-shrink-0">
                      <User className="w-6 h-6 text-green-700" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base">Self-Sponsored</p>
                      <p className="text-green-700 text-sm font-medium mt-0.5">Funds readily available</p>
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                        You are paying for this course yourself or your funds are already approved. You'll be taken directly to our secure payment page.
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary mt-1 flex-shrink-0 transition-colors" />
                  </div>
                </button>

                {/* Company-Sponsored Option */}
                <button
                  onClick={() => setModalStep('company-form')}
                  className="w-full text-left p-5 rounded-xl border-2 border-gray-200 hover:border-secondary hover:bg-secondary/3 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-orange-200 transition-colors flex-shrink-0">
                      <Building2 className="w-6 h-6 text-orange-700" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base">Company / Organisation Sponsored</p>
                      <p className="text-orange-700 text-sm font-medium mt-0.5">Going through an approval process</p>
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                        Your company or organisation will pay on your behalf. Fill in the details and our sales team will reach out to facilitate the process.
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-secondary mt-1 flex-shrink-0 transition-colors" />
                  </div>
                </button>

                <p className="text-xs text-gray-400 text-center pt-2">
                  Questions? Call or WhatsApp us on <span className="font-semibold">+254 713 955 653</span>
                </p>
              </div>
            )}

            {/* Step 2: Company Sponsorship Form */}
            {modalStep === 'company-form' && (
              <div className="p-6 space-y-6">

                {/* Back button */}
                <button
                  onClick={() => setModalStep('select')}
                  className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline"
                >
                  ← Back to selection
                </button>

                {/* Company Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-5 h-5 text-orange-600" />
                    <h3 className="font-bold text-gray-900">Company / Organisation Details</h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name *</label>
                      <input
                        type="text"
                        value={companyForm.companyName}
                        onChange={e => setCompanyForm(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="e.g. Acme Corporation Ltd"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Person *</label>
                      <input
                        type="text"
                        value={companyForm.contactPerson}
                        onChange={e => setCompanyForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                        placeholder="Name of HR / finance contact"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Phone *</label>
                      <input
                        type="tel"
                        value={companyForm.contactPhone}
                        onChange={e => setCompanyForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                        placeholder="+254 7XX XXX XXX"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={companyForm.contactEmail}
                        onChange={e => setCompanyForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                        placeholder="hr@company.com"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Participants */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-gray-900">Participants ({companyForm.participants.length})</h3>
                    </div>
                    <button
                      onClick={addParticipant}
                      className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Participant
                    </button>
                  </div>

                  <div className="space-y-3">
                    {companyForm.participants.map((participant, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-700">Participant {index + 1}</span>
                          {companyForm.participants.length > 1 && (
                            <button
                              onClick={() => removeParticipant(index)}
                              className="p-1 rounded hover:bg-red-100 text-red-500 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                            <input
                              type="text"
                              value={participant.name}
                              onChange={e => updateParticipant(index, 'name', e.target.value)}
                              placeholder="Full name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                            <input
                              type="email"
                              value={participant.email}
                              onChange={e => updateParticipant(index, 'email', e.target.value)}
                              placeholder="email@company.com"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Job Title</label>
                            <input
                              type="text"
                              value={participant.jobTitle}
                              onChange={e => updateParticipant(index, 'jobTitle', e.target.value)}
                              placeholder="e.g. HR Manager"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Notes</label>
                  <textarea
                    rows={3}
                    value={companyForm.additionalNotes}
                    onChange={e => setCompanyForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    placeholder="Any special requirements, dietary needs, or questions for our team..."
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2 space-y-3">
                  <button
                    onClick={handleCompanySubmit}
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-base transition-all shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {submitting ? 'Opening WhatsApp...' : 'Send to Sales Team via WhatsApp'}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    This will open WhatsApp with your details pre-filled. Our team will respond within 24 business hours.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
