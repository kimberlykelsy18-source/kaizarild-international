import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save, Search, Edit, Trash2, Plus, ArrowLeft, Image as ImageIcon, X, Eye, EyeOff, LayoutDashboard } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router';
import { industries } from '../../data/industries';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';

interface SubcategoryContent {
  industryId: string;
  subcategorySlug: string;
  subcategoryName: string;
  heroHeadline: string;
  heroDescription: string;
  heroImage?: string;
  overview: string;
  keyBenefits: Array<{ title: string; description: string; icon: string }>;
  trainingModules: Array<{ title: string; description: string; duration?: string }>;
  outcomes: string[];
  testimonial?: {
    quote: string;
    author: string;
    position: string;
    company: string;
  };
  faqs: Array<{ question: string; answer: string }>;
}

export default function AdminSubcategories() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [editingContent, setEditingContent] = useState<SubcategoryContent | null>(null);
  const [allContent, setAllContent] = useState<Record<string, SubcategoryContent>>({});
  const [dataLoading, setDataLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadAllContent();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadAllContent();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') as string).trim();
    const password = formData.get('password') as string;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      toast.error(`Login failed: ${error.message}`);
    } else {
      toast.success('Welcome back!');
      await loadAllContent();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    toast.success('Logged out successfully');
  };

  // Generate all subcategories from industries data
  const allSubcategories = industries.flatMap(industry =>
    industry.subCategories.map(sub => ({
      industryId: industry.id,
      industryName: industry.name,
      subcategoryName: sub.name,
      subcategorySlug: sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }))
  );

  // Load all content on mount
  const loadAllContent = async () => {
    setDataLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d/subcategories`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAllContent(data);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setDataLoading(false);
    }
  };

  const handleEdit = (subcategory: typeof allSubcategories[0]) => {
    const key = `${subcategory.industryId}_${subcategory.subcategorySlug}`;
    const existing = allContent[key];

    if (existing) {
      setEditingContent(existing);
    } else {
      // Create new empty content
      setEditingContent({
        industryId: subcategory.industryId,
        subcategorySlug: subcategory.subcategorySlug,
        subcategoryName: subcategory.subcategoryName,
        heroHeadline: subcategory.subcategoryName + ' Training',
        heroDescription: '',
        heroImage: '',
        overview: '',
        keyBenefits: [
          { title: 'Industry-Specific', description: '', icon: 'building' },
          { title: 'Measurable Results', description: '', icon: 'trending' },
          { title: 'Expert Trainers', description: '', icon: 'users' }
        ],
        trainingModules: [],
        outcomes: [],
        faqs: []
      });
    }
  };

  const handleSave = async () => {
    if (!editingContent) return;

    setDataLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d/subcategories`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-Kaizari-Auth': 'KAIZARI_ADMIN_2026',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editingContent)
        }
      );

      if (response.ok) {
        toast.success('Content saved successfully!');
        await loadAllContent();
        setEditingContent(null);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save content');
    } finally {
      setDataLoading(false);
    }
  };

  const handleDelete = async (industryId: string, subcategorySlug: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    setDataLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d/subcategories/${industryId}/${subcategorySlug}`,
        {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-Kaizari-Auth': 'KAIZARI_ADMIN_2026'
          }
        }
      );

      if (response.ok) {
        toast.success('Content deleted successfully!');
        await loadAllContent();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete content');
    } finally {
      setDataLoading(false);
    }
  };

  // Filter subcategories
  const filteredSubcategories = allSubcategories.filter(sub => {
    const matchesSearch = sub.subcategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.industryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || sub.industryId === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  if (editingContent) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setEditingContent(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to List
              </button>
              <Button onClick={handleSave} disabled={dataLoading}>
                <Save className="w-4 h-4 mr-2" />
                Save Content
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit: {editingContent.subcategoryName}
            </h1>
            <p className="text-gray-600 mt-2">
              Industry: {industries.find(i => i.id === editingContent.industryId)?.name}
            </p>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hero Section</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={editingContent.heroHeadline}
                  onChange={(e) => setEditingContent({ ...editingContent, heroHeadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Advanced Financial Modeling Training"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hero Description
                </label>
                <textarea
                  value={editingContent.heroDescription}
                  onChange={(e) => setEditingContent({ ...editingContent, heroDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Brief description for the hero section..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hero Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={editingContent.heroImage || ''}
                  onChange={(e) => setEditingContent({ ...editingContent, heroImage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com/your-image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter any image URL (Unsplash, your server, CDN, etc.). Recommended: 1920x1080px or larger.
                </p>
                {editingContent.heroImage && (
                  <img 
                    src={editingContent.heroImage} 
                    alt="Preview" 
                    className="mt-2 w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="12" fill="%239ca3af"%3EInvalid URL%3C/text%3E%3C/svg%3E';
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
            <textarea
              value={editingContent.overview}
              onChange={(e) => setEditingContent({ ...editingContent, overview: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Provide a comprehensive overview of the training program..."
            />
          </div>

          {/* Key Benefits */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Key Benefits</h2>
              <button
                onClick={() => setEditingContent({
                  ...editingContent,
                  keyBenefits: [...editingContent.keyBenefits, { title: '', description: '', icon: 'target' }]
                })}
                className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Benefit
              </button>
            </div>
            <div className="space-y-4">
              {editingContent.keyBenefits.map((benefit, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-semibold text-gray-700">Benefit {index + 1}</span>
                    <button
                      onClick={() => setEditingContent({
                        ...editingContent,
                        keyBenefits: editingContent.keyBenefits.filter((_, i) => i !== index)
                      })}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={benefit.title}
                    onChange={(e) => {
                      const newBenefits = [...editingContent.keyBenefits];
                      newBenefits[index].title = e.target.value;
                      setEditingContent({ ...editingContent, keyBenefits: newBenefits });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                    placeholder="Benefit title..."
                  />
                  <textarea
                    value={benefit.description}
                    onChange={(e) => {
                      const newBenefits = [...editingContent.keyBenefits];
                      newBenefits[index].description = e.target.value;
                      setEditingContent({ ...editingContent, keyBenefits: newBenefits });
                    }}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Benefit description..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Training Modules */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Training Modules</h2>
              <button
                onClick={() => setEditingContent({
                  ...editingContent,
                  trainingModules: [...editingContent.trainingModules, { title: '', description: '', duration: '' }]
                })}
                className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Module
              </button>
            </div>
            <div className="space-y-4">
              {editingContent.trainingModules.map((module, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-semibold text-gray-700">Module {index + 1}</span>
                    <button
                      onClick={() => setEditingContent({
                        ...editingContent,
                        trainingModules: editingContent.trainingModules.filter((_, i) => i !== index)
                      })}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => {
                      const newModules = [...editingContent.trainingModules];
                      newModules[index].title = e.target.value;
                      setEditingContent({ ...editingContent, trainingModules: newModules });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                    placeholder="Module title..."
                  />
                  <textarea
                    value={module.description}
                    onChange={(e) => {
                      const newModules = [...editingContent.trainingModules];
                      newModules[index].description = e.target.value;
                      setEditingContent({ ...editingContent, trainingModules: newModules });
                    }}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                    placeholder="Module description..."
                  />
                  <input
                    type="text"
                    value={module.duration || ''}
                    onChange={(e) => {
                      const newModules = [...editingContent.trainingModules];
                      newModules[index].duration = e.target.value;
                      setEditingContent({ ...editingContent, trainingModules: newModules });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Duration (e.g., 2 hours)"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">What You'll Learn (Outcomes)</h2>
              <button
                onClick={() => setEditingContent({
                  ...editingContent,
                  outcomes: [...editingContent.outcomes, '']
                })}
                className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Outcome
              </button>
            </div>
            <div className="space-y-2">
              {editingContent.outcomes.map((outcome, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => {
                      const newOutcomes = [...editingContent.outcomes];
                      newOutcomes[index] = e.target.value;
                      setEditingContent({ ...editingContent, outcomes: newOutcomes });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Learning outcome..."
                  />
                  <button
                    onClick={() => setEditingContent({
                      ...editingContent,
                      outcomes: editingContent.outcomes.filter((_, i) => i !== index)
                    })}
                    className="text-red-600 hover:text-red-700 px-3"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Testimonial (Optional)</h2>
            <div className="space-y-3">
              <textarea
                value={editingContent.testimonial?.quote || ''}
                onChange={(e) => setEditingContent({
                  ...editingContent,
                  testimonial: { ...editingContent.testimonial, quote: e.target.value, author: editingContent.testimonial?.author || '', position: editingContent.testimonial?.position || '', company: editingContent.testimonial?.company || '' }
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Testimonial quote..."
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={editingContent.testimonial?.author || ''}
                  onChange={(e) => setEditingContent({
                    ...editingContent,
                    testimonial: { ...editingContent.testimonial, author: e.target.value, quote: editingContent.testimonial?.quote || '', position: editingContent.testimonial?.position || '', company: editingContent.testimonial?.company || '' }
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Author name..."
                />
                <input
                  type="text"
                  value={editingContent.testimonial?.position || ''}
                  onChange={(e) => setEditingContent({
                    ...editingContent,
                    testimonial: { ...editingContent.testimonial, position: e.target.value, quote: editingContent.testimonial?.quote || '', author: editingContent.testimonial?.author || '', company: editingContent.testimonial?.company || '' }
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Position..."
                />
                <input
                  type="text"
                  value={editingContent.testimonial?.company || ''}
                  onChange={(e) => setEditingContent({
                    ...editingContent,
                    testimonial: { ...editingContent.testimonial, company: e.target.value, quote: editingContent.testimonial?.quote || '', author: editingContent.testimonial?.author || '', position: editingContent.testimonial?.position || '' }
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Company..."
                />
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">FAQs</h2>
              <button
                onClick={() => setEditingContent({
                  ...editingContent,
                  faqs: [...editingContent.faqs, { question: '', answer: '' }]
                })}
                className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add FAQ
              </button>
            </div>
            <div className="space-y-4">
              {editingContent.faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-semibold text-gray-700">FAQ {index + 1}</span>
                    <button
                      onClick={() => setEditingContent({
                        ...editingContent,
                        faqs: editingContent.faqs.filter((_, i) => i !== index)
                      })}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => {
                      const newFaqs = [...editingContent.faqs];
                      newFaqs[index].question = e.target.value;
                      setEditingContent({ ...editingContent, faqs: newFaqs });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                    placeholder="Question..."
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(e) => {
                      const newFaqs = [...editingContent.faqs];
                      newFaqs[index].answer = e.target.value;
                      setEditingContent({ ...editingContent, faqs: newFaqs });
                    }}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Answer..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setEditingContent(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={dataLoading}>
              <Save className="w-4 h-4 mr-2" />
              Save Content
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Industry Training Portal</h2>
            <p className="text-gray-500 mt-2">Sign in to manage training content</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6">
              Sign In
            </Button>
          </form>

          <p className="text-center mt-6 text-xs text-gray-500">
            Use the same credentials as the blog admin portal
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link
                to="/admin"
                className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Admin Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Manage Training Content</h1>
              <p className="text-gray-600 mt-2">Create and edit course catalog content for all subcategories</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search subcategories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Industries</option>
              {industries.map(industry => (
                <option key={industry.id} value={industry.id}>{industry.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Subcategories List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {dataLoading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Subcategory
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Industry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSubcategories.map((sub, index) => {
                    const key = `${sub.industryId}_${sub.subcategorySlug}`;
                    const hasContent = !!allContent[key];

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">{sub.subcategoryName}</div>
                          <div className="text-xs text-gray-500">/industries/{sub.industryId}/{sub.subcategorySlug}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{sub.industryName}</span>
                        </td>
                        <td className="px-6 py-4">
                          {hasContent ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                              Empty
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(sub)}
                              className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            {hasContent && (
                              <button
                                onClick={() => handleDelete(sub.industryId, sub.subcategorySlug)}
                                className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{allSubcategories.length}</div>
              <div className="text-sm text-gray-600">Total Subcategories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{Object.keys(allContent).length}</div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-400">
                {allSubcategories.length - Object.keys(allContent).length}
              </div>
              <div className="text-sm text-gray-600">Empty</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}