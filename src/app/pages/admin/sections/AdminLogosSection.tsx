import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { supabase } from '../../../utils/supabase/client';
import { Plus, Trash2, Upload, Image } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d`;
const MASTER_KEY = 'KAIZARI_ADMIN_2026';

interface ClientLogo {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  createdAt: string;
}

export default function AdminLogosSection() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchLogos = () => {
    fetch(`${API_BASE}/logos`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
    })
      .then((r) => r.json())
      .then((data) => setLogos(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to load logos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLogos(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('client-logos')
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('client-logos').getPublicUrl(fileName);
      setNewUrl(publicUrl);
      toast.success('Logo uploaded — fill in the name and save');
    } catch {
      toast.error('Upload failed. Make sure the "client-logos" bucket exists and is public in Supabase Storage.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!newName.trim()) { toast.error('Client name is required'); return; }
    if (!newUrl.trim()) { toast.error('Upload a logo or paste a URL'); return; }
    try {
      const res = await fetch(`${API_BASE}/logos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName, description: newDescription, logoUrl: newUrl }),
      });
      if (!res.ok) throw new Error();
      toast.success('Logo added!');
      setNewName(''); setNewDescription(''); setNewUrl(''); setShowForm(false);
      fetchLogos();
    } catch {
      toast.error('Failed to save logo');
    }
  };

  const handleDelete = async (logo: ClientLogo) => {
    if (!confirm(`Remove ${logo.name}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/logos/${logo.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
        },
      });
      if (!res.ok) throw new Error();
      toast.success('Logo removed');
      fetchLogos();
    } catch {
      toast.error('Failed to delete logo');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading logos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Client Logos</h2>
          <p className="text-gray-600 mt-1">Manage logos shown in the "Trusted by" section on the homepage</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Logo
        </button>
      </div>

      {/* Add Logo Form */}
      {showForm && (
        <div className="bg-white rounded-xl border-2 border-orange-200 p-6 space-y-5">
          <h3 className="text-lg font-bold text-gray-900">Add New Client Logo</h3>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Logo Image</label>
            <label className={`flex items-center gap-3 cursor-pointer border-2 border-dashed rounded-lg p-4 transition-colors ${uploading ? 'border-gray-300 opacity-60' : 'border-orange-300 hover:border-orange-500 hover:bg-orange-50'}`}>
              <Upload className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span className="text-sm text-gray-600">{uploading ? 'Uploading...' : 'Click to upload (PNG, JPG, SVG, WebP)'}</span>
              <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleFileUpload} />
            </label>
          </div>

          {/* URL preview / paste */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Logo URL</label>
            <div className="flex gap-3">
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Auto-filled after upload, or paste a URL"
              />
              {newUrl && (
                <img src={newUrl} alt="preview" className="h-10 w-10 object-contain border border-gray-200 rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Client Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g. ZEP-RE"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Industry / Description</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g. Reinsurance"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">
              Save Logo
            </button>
            <button onClick={() => { setShowForm(false); setNewName(''); setNewDescription(''); setNewUrl(''); }} className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Logos Grid */}
      {logos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No client logos yet</p>
          <p className="text-gray-400 text-sm">Add your first client logo to display it on the homepage</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {logos.map((logo) => (
            <div key={logo.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow group relative">
              <button
                onClick={() => handleDelete(logo)}
                className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="h-12 w-full flex items-center justify-center">
                {logo.logoUrl ? (
                  <img src={logo.logoUrl} alt={logo.name} className="h-full w-auto object-contain" />
                ) : (
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-primary">{logo.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-900 line-clamp-1">{logo.name}</p>
                {logo.description && <p className="text-[10px] text-gray-400 line-clamp-1">{logo.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
