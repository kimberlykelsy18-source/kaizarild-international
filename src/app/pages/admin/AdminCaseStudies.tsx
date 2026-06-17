import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { ChevronLeft, Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';

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
  createdAt: string;
  updatedAt: string;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d`;
const MASTER_KEY = 'KAIZARI_ADMIN_2026';

export default function AdminCaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const response = await fetch(`${API_BASE}/case-studies`, {
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

  const handleCreate = () => {
    const newCaseStudy: CaseStudy = {
      id: `case-study-${Date.now()}`,
      client: '',
      industry: '',
      participants: '',
      program: '',
      challenge: 'Training Needs & Business Challenge',
      challengeDetails: '',
      solution: 'Our Approach',
      solutionDetails: '',
      outcomes: [{ metric: '', description: '' }],
      impact: '',
      testimonial: { quote: '', role: '' },
      published: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingCaseStudy(newCaseStudy);
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!editingCaseStudy) return;

    // Validate required fields
    if (!editingCaseStudy.client.trim()) {
      toast.error('Please enter a client name');
      return;
    }

    try {
      const url = isCreating 
        ? `${API_BASE}/case-studies`
        : `${API_BASE}/case-studies/${editingCaseStudy.id}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingCaseStudy),
      });

      if (!response.ok) throw new Error('Failed to save case study');

      toast.success(isCreating ? 'Case study created successfully!' : 'Case study updated successfully!');
      setEditingCaseStudy(null);
      setIsCreating(false);
      fetchCaseStudies();
    } catch (error) {
      console.error('Error saving case study:', error);
      toast.error('Failed to save case study');
    }
  };

  const handleDelete = async (caseStudyId: string) => {
    if (!confirm('Are you sure you want to delete this case study? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/case-studies/${caseStudyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
        },
      });

      if (!response.ok) throw new Error('Failed to delete case study');

      toast.success('Case study deleted successfully');
      fetchCaseStudies();
    } catch (error) {
      console.error('Error deleting case study:', error);
      toast.error('Failed to delete case study');
    }
  };

  const handleTogglePublished = async (caseStudy: CaseStudy) => {
    try {
      const response = await fetch(`${API_BASE}/case-studies/${caseStudy.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...caseStudy, published: !caseStudy.published }),
      });

      if (!response.ok) throw new Error('Failed to update case study');

      toast.success(caseStudy.published ? 'Case study unpublished' : 'Case study published');
      fetchCaseStudies();
    } catch (error) {
      console.error('Error toggling published status:', error);
      toast.error('Failed to update case study');
    }
  };

  const addOutcome = () => {
    if (editingCaseStudy) {
      setEditingCaseStudy({
        ...editingCaseStudy,
        outcomes: [...editingCaseStudy.outcomes, { metric: '', description: '' }],
      });
    }
  };

  const removeOutcome = (index: number) => {
    if (editingCaseStudy) {
      setEditingCaseStudy({
        ...editingCaseStudy,
        outcomes: editingCaseStudy.outcomes.filter((_, i) => i !== index),
      });
    }
  };

  const updateOutcome = (index: number, field: 'metric' | 'description', value: string) => {
    if (editingCaseStudy) {
      const newOutcomes = [...editingCaseStudy.outcomes];
      newOutcomes[index][field] = value;
      setEditingCaseStudy({
        ...editingCaseStudy,
        outcomes: newOutcomes,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading case studies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/admin"
                className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-2 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Admin Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Manage Case Studies</h1>
              <p className="text-gray-600 mt-2">
                Create, edit, and manage client success stories
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create New Case Study
            </button>
          </div>
        </div>

        {/* Case Studies List */}
        <div className="space-y-6">
          {caseStudies.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No case studies created yet</p>
              <button
                onClick={handleCreate}
                className="text-primary hover:underline font-semibold"
              >
                Create your first case study
              </button>
            </div>
          ) : (
            caseStudies.map((caseStudy) => (
              <div
                key={caseStudy.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{caseStudy.client}</h3>
                      {caseStudy.published ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          Published
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                          <EyeOff className="w-3 h-3" />
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-semibold">Industry:</span> {caseStudy.industry}
                      </div>
                      <div>
                        <span className="font-semibold">Program:</span> {caseStudy.program}
                      </div>
                    </div>
                    <p className="text-gray-700 line-clamp-2">{caseStudy.challengeDetails}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleTogglePublished(caseStudy)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        caseStudy.published
                          ? 'border-green-200 bg-green-50 hover:bg-green-100 text-green-700'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600'
                      }`}
                      title={caseStudy.published ? 'Unpublish' : 'Publish'}
                    >
                      {caseStudy.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingCaseStudy(caseStudy);
                        setIsCreating(false);
                      }}
                      className="p-2 border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(caseStudy.id)}
                      className="p-2 border-2 border-red-200 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      {editingCaseStudy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {isCreating ? 'Create New Case Study' : 'Edit Case Study'}
              </h2>
              <button
                onClick={() => {
                  setEditingCaseStudy(null);
                  setIsCreating(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCaseStudy.client}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, client: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., ZEP-RE (PTA Reinsurance Company)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={editingCaseStudy.industry}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, industry: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Reinsurance & Financial Services"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Participants (Optional)
                    </label>
                    <input
                      type="text"
                      value={editingCaseStudy.participants || ''}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, participants: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Soliton Telmec, Tropic Air..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Training Program
                  </label>
                  <input
                    type="text"
                    value={editingCaseStudy.program}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, program: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., In-House Intermediate-Advanced Excel Training"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCaseStudy.published}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, published: e.target.checked })}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm font-semibold text-gray-700">Published (Visible on website)</span>
                </label>
              </div>

              {/* Challenge */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Challenge</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Challenge Title
                  </label>
                  <input
                    type="text"
                    value={editingCaseStudy.challenge}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, challenge: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Training Needs & Business Challenge"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Challenge Details
                  </label>
                  <textarea
                    value={editingCaseStudy.challengeDetails}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, challengeDetails: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Describe the client's challenges and pain points..."
                  />
                </div>
              </div>

              {/* Solution */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Solution</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Solution Title
                  </label>
                  <input
                    type="text"
                    value={editingCaseStudy.solution}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, solution: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Our Approach"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Solution Details
                  </label>
                  <textarea
                    value={editingCaseStudy.solutionDetails}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, solutionDetails: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Describe how you addressed the challenges..."
                  />
                </div>
              </div>

              {/* Outcomes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Key Outcomes</h3>
                  <button
                    onClick={addOutcome}
                    className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Outcome
                  </button>
                </div>
                {editingCaseStudy.outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={outcome.metric}
                        onChange={(e) => updateOutcome(index, 'metric', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Metric (e.g., 40%, ROI, 25)"
                      />
                      <input
                        type="text"
                        value={outcome.description}
                        onChange={(e) => updateOutcome(index, 'description', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Description (e.g., Reduction in reporting time)"
                      />
                    </div>
                    <button
                      onClick={() => removeOutcome(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Impact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Impact Statement</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Overall Impact
                  </label>
                  <textarea
                    value={editingCaseStudy.impact}
                    onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, impact: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Describe the overall impact and results..."
                  />
                </div>
              </div>

              {/* Testimonial */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Client Testimonial</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quote
                  </label>
                  <textarea
                    value={editingCaseStudy.testimonial.quote}
                    onChange={(e) => setEditingCaseStudy({
                      ...editingCaseStudy,
                      testimonial: { ...editingCaseStudy.testimonial, quote: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter the client's testimonial quote..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role/Title
                  </label>
                  <input
                    type="text"
                    value={editingCaseStudy.testimonial.role}
                    onChange={(e) => setEditingCaseStudy({
                      ...editingCaseStudy,
                      testimonial: { ...editingCaseStudy.testimonial, role: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Head of Finance, Company Name"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => {
                  setEditingCaseStudy(null);
                  setIsCreating(false);
                }}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                {isCreating ? 'Create Case Study' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
