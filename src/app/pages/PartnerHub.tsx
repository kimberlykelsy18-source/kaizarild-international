import { useState, useEffect } from 'react';
import { Award, Users, TrendingUp, BookOpen, Upload, Zap, ShieldCheck, Presentation, Target, MessageSquare, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { sendToWhatsApp } from '../utils/whatsapp';

export default function PartnerHub() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    yearsExperience: '',
    specialization: '',
    industries: '',
    cv: '',
    trainingApproach: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendToWhatsApp(formData, 'New Trainer Application');
    toast.success('Opening WhatsApp to submit your application...');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      yearsExperience: '',
      specialization: '',
      industries: '',
      cv: '',
      trainingApproach: '',
    });
  };

  const requirements = [
    { icon: Briefcase, title: 'Domain Expertise', desc: 'Subject matter authority with real-world application.' },
    { icon: Presentation, title: 'Pedagogical Excellence', desc: 'Ability to engage and simplify complex theories.' },
    { icon: ShieldCheck, title: 'Corporate Ethics', desc: 'High standards of business professionalism.' },
    { icon: Target, title: 'Impact-Driven', desc: 'Focus on measurable ROI for organizations.' },
    { icon: MessageSquare, title: 'Dynamic Delivery', desc: 'Exceptional classroom and boardroom presence.' },
    { icon: GraduationCap, title: 'Inclusive Mentorship', desc: 'Welcoming learners at all professional levels.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Compact */}
      <div className="bg-[#005A7C] text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-[#F57C00] text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs font-bold mb-3 md:mb-4 uppercase tracking-wider">
                Partnership 2026
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight">
                Partner with <span className="text-[#F57C00]">East Africa's Best</span>
              </h1>
              <p className="text-sm md:text-lg text-white/80 max-w-xl">
                Elevate your professional impact by joining our elite network of industry trainers and consultants.
              </p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
              <Button 
                onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg"
                className="bg-[#F57C00] hover:bg-[#e67300] text-white font-bold w-full md:px-8 md:py-7 rounded-xl shadow-lg"
              >
                Apply Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid lg:grid-cols-12 gap-10 md:gap-12 items-start">
          
          {/* Left Column: Info & Requirements (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-8 md:space-y-10">
            <div>
              <h2 className="text-blue-900 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-3">Professional Standards</h2>
              <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-6 uppercase tracking-tight">Trainer Requirements</h3>
              <p className="text-gray-600 mb-8 text-sm md:text-base leading-relaxed">
                We maintain rigorous standards to ensure our clients receive transformative training. 
                We look for experts who possess both depth of knowledge and the ability to inspire.
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#005A7C]/20 transition-colors">
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex-shrink-0">
                      <req.icon className="w-5 h-5 text-[#F57C00]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{req.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed mt-1">{req.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#005A7C] text-white p-6 rounded-2xl shadow-xl">
              <h4 className="font-bold text-lg mb-2">Why Kaizari?</h4>
              <ul className="space-y-3">
                {[
                  'Access to blue-chip corporate clients',
                  'Competitive professional fees',
                  'Global standards & methodology',
                  'Professional growth & networking'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/90">
                    <ShieldCheck className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-7" id="apply">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#F57C00]/5 rounded-bl-full pointer-events-none" />
              
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Trainer Application</h2>
                <p className="text-gray-500 text-sm">Review time: 48 business hours via WhatsApp</p>
              </div>

              <div className="flex items-center gap-3 bg-[#005A7C]/5 p-4 rounded-xl mb-8 border border-[#005A7C]/10">
                <Zap className="w-5 h-5 text-[#005A7C] flex-shrink-0" />
                <p className="text-[#005A7C] text-xs md:text-sm font-medium">
                  <strong>Fast Application:</strong> Complete the fields below to open a direct WhatsApp submission with our recruitment team.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-gray-700 text-xs font-bold uppercase tracking-wider">Full Name *</Label>
                    <Input id="fullName" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Dr. John Kamau" className="h-11 bg-gray-50/50 rounded-lg border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-gray-700 text-xs font-bold uppercase tracking-wider">Corporate Email *</Label>
                    <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" className="h-11 bg-gray-50/50 rounded-lg border-gray-200" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-gray-700 text-xs font-bold uppercase tracking-wider">WhatsApp Number *</Label>
                    <Input id="phone" type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+254 7XX XXX XXX" className="h-11 bg-gray-50/50 rounded-lg border-gray-200" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="location" className="text-gray-700 text-xs font-bold uppercase tracking-wider">Location *</Label>
                    <Input id="location" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Nairobi, Kenya" className="h-11 bg-gray-50/50 rounded-lg border-gray-200" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="yearsExperience" className="text-gray-700 text-xs font-bold uppercase tracking-wider">Experience Level</Label>
                    <Select value={formData.yearsExperience} onValueChange={(value) => setFormData({ ...formData, yearsExperience: value })}>
                      <SelectTrigger className="h-11 bg-gray-50/50 rounded-lg border-gray-200">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-2">Early Career (0-2y)</SelectItem>
                        <SelectItem value="3-5">Established (3-5y)</SelectItem>
                        <SelectItem value="5-10">Senior Expert (5-10y)</SelectItem>
                        <SelectItem value="10+">Principal (10+y)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="specialization" className="text-gray-700 text-xs font-bold uppercase tracking-wider">Primary Field *</Label>
                    <Input id="specialization" required value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} placeholder="e.g. Financial Risk" className="h-11 bg-gray-50/50 rounded-lg border-gray-200" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="industries" className="text-gray-700 text-xs font-bold uppercase tracking-wider">Industry Footprint *</Label>
                  <Input id="industries" required value={formData.industries} onChange={(e) => setFormData({ ...formData, industries: e.target.value })} placeholder="e.g. Banking, Tech, Manufacturing" className="h-11 bg-gray-50/50 rounded-lg border-gray-200" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cv" className="text-gray-700 text-xs font-bold uppercase tracking-wider">Portfolio / LinkedIn Link *</Label>
                  <div className="flex gap-2">
                    <Input id="cv" required value={formData.cv} onChange={(e) => setFormData({ ...formData, cv: e.target.value })} placeholder="Link to profile or CV" className="h-11 bg-gray-50/50 rounded-lg border-gray-200" />
                    <Button type="button" variant="outline" className="h-11 w-11 p-0 rounded-lg">
                      <Upload className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="trainingApproach" className="text-gray-700 text-xs font-bold uppercase tracking-wider">Training Methodology *</Label>
                  <Textarea id="trainingApproach" required value={formData.trainingApproach} onChange={(e) => setFormData({ ...formData, trainingApproach: e.target.value })} placeholder="Briefly describe how you ensure engagement..." className="bg-gray-50/50 rounded-lg border-gray-200 min-h-[80px]" rows={3} />
                </div>

                <div className="pt-2">
                  <Button type="submit" size="lg" className="w-full bg-[#F57C00] hover:bg-[#e67300] text-white font-bold py-6 rounded-xl shadow-lg transition-transform active:scale-[0.98]">
                    Submit via WhatsApp
                  </Button>
                  <p className="text-[10px] text-gray-400 text-center mt-3 uppercase tracking-tighter">
                    Submission opens a direct chat window
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}