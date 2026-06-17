import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  program: string;
  challengeDetails: string;
  solutionDetails: string;
  impact: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d`;
const MASTER_KEY = 'KAIZARI_ADMIN_2026';

export default function AdminCaseStudiesSection() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const response = await fetch(`${API_BASE}/case-studies`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setCaseStudies(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load case studies');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing({
      id: `cs-${Date.now()}`,
      client: '',
      industry: '',
      program: '',
      challengeDetails: '',
      solutionDetails: '',
      impact: '',
      published: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.client.trim()) {
      toast.error('Please enter client name');
      return;
    }

    try {
      const url = isCreating ? `${API_BASE}/case-studies` : `${API_BASE}/case-studies/${editing.id}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editing),
      });

      if (!response.ok) throw new Error('Failed to save');
      toast.success(isCreating ? 'Case study created!' : 'Case study updated!');
      setEditing(null);
      setIsCreating(false);
      fetchCaseStudies();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this case study?')) return;
    try {
      const response = await fetch(`${API_BASE}/case-studies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
        },
      });
      if (!response.ok) throw new Error('Failed to delete');
      toast.success('Deleted');
      fetchCaseStudies();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleTogglePublished = async (cs: CaseStudy) => {
    try {
      const response = await fetch(`${API_BASE}/case-studies/${cs.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...cs, published: !cs.published }),
      });
      if (!response.ok) throw new Error('Failed');
      toast.success(cs.published ? 'Unpublished' : 'Published');
      fetchCaseStudies();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading case studies...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Case Studies Management</h2>
          <p className="text-gray-600 mt-1">Manage client success stories</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Case Study
        </button>
      </div>

      {caseStudies.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <p className="text-gray-500 mb-4">No case studies yet</p>
          <button onClick={handleCreate} className="text-green-600 hover:underline font-semibold">
            Create your first case study
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {caseStudies.map((cs) => (
            <div key={cs.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{cs.client}</h3>
                    {cs.published ? (
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
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Industry:</strong> {cs.industry}
                  </p>
                  <p className="text-gray-700 line-clamp-2">{cs.challengeDetails}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleTogglePublished(cs)}
                    className={`p-2 rounded-lg border-2 ${
                      cs.published
                        ? 'border-green-200 bg-green-50 hover:bg-green-100 text-green-700'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cs.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(cs);
                      setIsCreating(false);
                    }}
                    className="p-2 border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cs.id)}
                    className="p-2 border-2 border-red-200 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-bold">{isCreating ? 'Create' : 'Edit'} Case Study</h2>
              <button onClick={() => { setEditing(null); setIsCreating(false); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editing.client}
                  onChange={(e) => setEditing({ ...editing, client: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Industry</label>
                <input
                  type="text"
                  value={editing.industry}
                  onChange={(e) => setEditing({ ...editing, industry: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Program/Training</label>
                <input
                  type="text"
                  value={editing.program}
                  onChange={(e) => setEditing({ ...editing, program: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Challenge Details</label>
                <textarea
                  value={editing.challengeDetails}
                  onChange={(e) => setEditing({ ...editing, challengeDetails: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Solution Details</label>
                <textarea
                  value={editing.solutionDetails}
                  onChange={(e) => setEditing({ ...editing, solutionDetails: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Impact</label>
                <textarea
                  value={editing.impact}
                  onChange={(e) => setEditing({ ...editing, impact: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.published}
                  onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold">Published</span>
              </label>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => { setEditing(null); setIsCreating(false); }}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isCreating ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
