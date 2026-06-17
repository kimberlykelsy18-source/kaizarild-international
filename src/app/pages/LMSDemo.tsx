import { useState } from 'react';
import { Monitor, Users, BookOpen, BarChart, Award, Clock, Calendar, Users2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { sendToWhatsApp } from '../utils/whatsapp';

export default function LMSDemo() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    companySize: '',
    industry: '',
    preferredDate: '',
    preferredTime: '',
    specificNeeds: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    sendToWhatsApp(formData, 'LMS Demo Request');

    toast.success('Opening WhatsApp to schedule your demo...');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      companySize: '',
      industry: '',
      preferredDate: '',
      preferredTime: '',
      specificNeeds: '',
    });
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Content Library',
      description: 'Access to extensive training materials, courses, and resources across all industries',
    },
    {
      icon: Users,
      title: 'Interactive Learning',
      description: 'Engage with trainers and peers through discussion forums, live sessions, and Q&A',
    },
    {
      icon: BarChart,
      title: 'Advanced Analytics',
      description: 'Track individual and team progress, completion rates, and learning outcomes',
    },
    {
      icon: Award,
      title: 'Recognized Certifications',
      description: 'Earn valuable certificates upon successful course completion',
    },
    {
      icon: Clock,
      title: 'Flexible Learning Paths',
      description: 'Self-paced learning that fits your team\'s schedule and business needs',
    },
    {
      icon: Monitor,
      title: 'Modern Platform',
      description: 'Intuitive, mobile-responsive interface accessible from any device',
    },
  ];

  const benefits = [
    'Reduce training costs by up to 50%',
    'Standardize learning across all locations',
    'Scale training effortlessly as you grow',
    'Ensure compliance and track completion',
    'Provide 24/7 access to learning resources',
    'Generate detailed ROI reports',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-gray-900 text-white py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <div className="inline-block bg-secondary text-white px-3 md:px-4 py-2 rounded-full text-xs font-bold mb-4 md:mb-6 uppercase tracking-wider">
                Learning Management System
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                Transform Training with Our LMS
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8">
                Experience the future of corporate learning. Book a personalized demo to see how our 
                LMS platform can revolutionize your organization's training and development.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users2 className="w-5 h-5 text-yellow-400" />
                  <span className="text-base md:text-lg">150+ Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-base md:text-lg">Industry Leading</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur-2xl opacity-30" />
                <img
                  src="https://images.unsplash.com/photo-1739303987830-ca19742b19bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGJ1c2luZXNzJTIwdGVhbSUyMGNvbGxhYm9yYXRpb258ZW58MXx8fHwxNzY5MTA3ODMwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="LMS Platform"
                  className="relative rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Learning
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to deliver engaging, effective training at scale
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-primary rounded-2xl p-6 md:p-12 text-white mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Why Organizations Choose Our LMS
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-gray-900 text-sm">✓</span>
                  </div>
                  <span className="text-base md:text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Request Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Book Your Personalized Demo
              </h2>
              <p className="text-gray-600 text-base md:text-lg">
                Schedule a live demo with our team. We'll walk you through the platform, answer your 
                questions, and show you exactly how our LMS can benefit your organization.
              </p>
            </div>

            <form id="demo-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Work Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 700 000 000"
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company Name"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="position">Your Position *</Label>
                  <Input
                    id="position"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="HR Manager, L&D Director, etc."
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="companySize">Company Size *</Label>
                  <Select value={formData.companySize} onValueChange={(value) => setFormData({ ...formData, companySize: value })} required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-50">1-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agriculture">Agriculture & Machinery</SelectItem>
                    <SelectItem value="finance">Finance Services</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing & Industry</SelectItem>
                    <SelectItem value="real-estate">Real Estate & Services</SelectItem>
                    <SelectItem value="import-export">Import and Export Services</SelectItem>
                    <SelectItem value="ai-tech">AI Tools, Companies & Start-Ups</SelectItem>
                    <SelectItem value="business-marketing">Business & Marketing</SelectItem>
                    <SelectItem value="insurance">Insurance & Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="preferredDate">Preferred Demo Date</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Select value={formData.preferredTime} onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9am-11am">9:00 AM - 11:00 AM</SelectItem>
                      <SelectItem value="11am-1pm">11:00 AM - 1:00 PM</SelectItem>
                      <SelectItem value="2pm-4pm">2:00 PM - 4:00 PM</SelectItem>
                      <SelectItem value="4pm-6pm">4:00 PM - 6:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="specificNeeds">Specific Needs or Questions</Label>
                <Textarea
                  id="specificNeeds"
                  value={formData.specificNeeds}
                  onChange={(e) => setFormData({ ...formData, specificNeeds: e.target.value })}
                  placeholder="Tell us what you'd like to focus on during the demo..."
                  rows={4}
                />
              </div>

              <Button type="submit" size="lg" className="w-full bg-primary text-lg py-6">
                Request Demo on WhatsApp
              </Button>

              <p className="text-sm text-gray-500 text-center">
                This will open a WhatsApp chat with our team to schedule your demo
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}