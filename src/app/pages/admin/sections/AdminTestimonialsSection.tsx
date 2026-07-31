import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface Testimonial {
  id?: string;
  company: string;
  role: string;
  content: string;
  program?: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d`;
const MASTER_KEY = 'KAIZARI_ADMIN_2026';

export default function AdminTestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/testimonials`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing({ company: '', role: '', content: '', program: '', published: false });
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.content.trim()) {
      toast.error('Please enter quote content');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
        },
        body: JSON.stringify(editing)
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success(isCreating ? 'Testimonial created' : 'Testimonial updated');
      setEditing(null);
      setIsCreating(false);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save testimonial');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Delete this testimonial?')) return;
    try {
      const res = await fetch(`${API_BASE}/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
        }
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Deleted');
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  const togglePublished = async (item: Testimonial) => {
    try {
      const res = await fetch(`${API_BASE}/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
        },
        body: JSON.stringify({ ...item, published: !item.published })
      });
      if (!res.ok) throw new Error('Update failed');
      toast.success(item.published ? 'Unpublished' : 'Published');
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
          <p className="text-gray-600">Manage client testimonials displayed on the homepage</p>
        </div>
        <button onClick={handleCreate} className="bg-primary text-white px-4 py-2 rounded">+ New</button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">No testimonials yet</div>
      ) : (
        <div className="space-y-4">
          {items.map(i => (
            <div key={i.id} className="bg-white rounded-lg p-4 flex items-start justify-between border">
              <div>
                <p className="italic">"{i.content}"</p>
                <p className="text-sm text-gray-500 mt-2">{i.role} — <span className="font-bold">{i.company}</span> {i.program ? `• ${i.program}` : ''}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => { setEditing(i); setIsCreating(false); }} className="p-2 border rounded text-primary"><Edit2 className="w-4 h-4"/></button>
                <button onClick={() => handleDelete(i.id)} className="p-2 border rounded text-red-600"><Trash2 className="w-4 h-4"/></button>
                <button onClick={() => togglePublished(i)} className="p-2 border rounded text-sm">{i.published ? 'Unpublish' : 'Publish'}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h3 className="text-lg font-bold mb-4">{isCreating ? 'Create Testimonial' : 'Edit Testimonial'}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700">Quote</label>
                <textarea rows={4} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input placeholder="Company" value={editing.company} onChange={(e) => setEditing({ ...editing, company: e.target.value })} className="px-3 py-2 border rounded" />
                <input placeholder="Role" value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="px-3 py-2 border rounded" />
                <input placeholder="Program (optional)" value={editing.program} onChange={(e) => setEditing({ ...editing, program: e.target.value })} className="px-3 py-2 border rounded" />
              </div>
              <div className="flex items-center gap-3 justify-end mt-4">
                <button onClick={() => { setEditing(null); setIsCreating(false); }} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
