import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase/client';
import { ChevronLeft, Plus, Edit2, Trash2, Eye, EyeOff, Save, X, Link2, FileText, Upload } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';

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
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const KV_TABLE = 'kv_store_420cbc7d';
const EVENTS_PREFIX = 'events_420cbc7d:';

async function kvGetEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from(KV_TABLE)
    .select('key, value')
    .like('key', `${EVENTS_PREFIX}%`);
  if (error) throw error;
  return (data || []).map((r: any) => r.value).filter(Boolean);
}

async function kvSaveEvent(event: Event): Promise<void> {
  const { error } = await supabase
    .from(KV_TABLE)
    .upsert({ key: `${EVENTS_PREFIX}${event.id}`, value: event });
  if (error) throw error;
}

async function kvDeleteEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from(KV_TABLE)
    .delete()
    .eq('key', `${EVENTS_PREFIX}${id}`);
  if (error) throw error;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const list = await kvGetEvents();
      list.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setEvents(list);
    } catch (err) {
      console.error('fetchEvents error:', err);
      toast.error('Failed to load events. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    const now = new Date().toISOString();
    setEditingEvent({
      id: `event-${Date.now()}`,
      title: '',
      dates: '',
      duration: '',
      time: '',
      location: '',
      capacity: '',
      seatsRemaining: null,
      category: 'Finance Services',
      featured: false,
      description: '',
      outcomes: [''],
      whoShouldAttend: [''],
      paymentLink: '',
      brochureUrl: '',
      published: false,
      createdAt: now,
      updatedAt: now,
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    if (!editingEvent) return;
    if (!editingEvent.title.trim()) {
      toast.error('Please enter an event title');
      return;
    }
    setSaving(true);
    try {
      const toSave = { ...editingEvent, updatedAt: new Date().toISOString() };
      await kvSaveEvent(toSave);
      toast.success(isCreating ? 'Event created!' : 'Event updated!');
      setEditingEvent(null);
      setIsCreating(false);
      await fetchEvents();
    } catch (err) {
      console.error('handleSave error:', err);
      toast.error('Failed to save event. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    try {
      await kvDeleteEvent(id);
      toast.success('Event deleted');
      await fetchEvents();
    } catch (err) {
      console.error('handleDelete error:', err);
      toast.error('Failed to delete event.');
    }
  };

  const handleTogglePublished = async (event: Event) => {
    try {
      await kvSaveEvent({ ...event, published: !event.published, updatedAt: new Date().toISOString() });
      toast.success(event.published ? 'Event unpublished' : 'Event published');
      await fetchEvents();
    } catch (err) {
      console.error('handleTogglePublished error:', err);
      toast.error('Failed to update event.');
    }
  };

  const handleBrochureFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingEvent) return;
    setUploadingBrochure(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${editingEvent.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('event-brochures')
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from('event-brochures')
        .getPublicUrl(fileName);
      update('brochureUrl', publicUrl);
      toast.success('Brochure uploaded successfully!');
    } catch (err) {
      console.error('Brochure upload error:', err);
      toast.error('Upload failed. Ensure the "event-brochures" bucket exists in Supabase Storage (set to public).');
    } finally {
      setUploadingBrochure(false);
      e.target.value = '';
    }
  };

  const update = (field: keyof Event, value: any) =>
    setEditingEvent((prev) => prev ? { ...prev, [field]: value } : prev);

  const updateOutcome = (i: number, val: string) => {
    if (!editingEvent) return;
    const arr = [...editingEvent.outcomes];
    arr[i] = val;
    update('outcomes', arr);
  };

  const updateAttendee = (i: number, val: string) => {
    if (!editingEvent) return;
    const arr = [...editingEvent.whoShouldAttend];
    arr[i] = val;
    update('whoShouldAttend', arr);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading events...</p>
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
              <Link to="/admin" className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-2 transition-colors">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Admin Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
              <p className="text-gray-600 mt-1">Create, edit, and manage open course events</p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create New Event
            </button>
          </div>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No events yet</p>
            <button onClick={handleCreate} className="text-primary hover:underline font-semibold">
              Create your first event
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                      {event.featured && (
                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold">FEATURED</span>
                      )}
                      {event.published ? (
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                          <EyeOff className="w-3 h-3" /> Draft
                        </span>
                      )}
                      {event.paymentLink && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                          <Link2 className="w-3 h-3" /> Payment set
                        </span>
                      )}
                      {event.brochureUrl && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Brochure set
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mb-2">
                      <div><span className="font-semibold">Dates:</span> {event.dates || '—'}</div>
                      <div><span className="font-semibold">Duration:</span> {event.duration || '—'}</div>
                      <div><span className="font-semibold">Location:</span> {event.location || '—'}</div>
                      <div><span className="font-semibold">Category:</span> {event.category || '—'}</div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleTogglePublished(event)}
                      className={`p-2 rounded-lg border-2 transition-all ${event.published ? 'border-green-200 bg-green-50 hover:bg-green-100 text-green-700' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-500'}`}
                      title={event.published ? 'Unpublish' : 'Publish'}
                    >
                      {event.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => { setEditingEvent(event); setIsCreating(false); }}
                      className="p-2 border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 border-2 border-red-200 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8">

            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {isCreating ? 'Create New Event' : 'Edit Event'}
              </h2>
              <button onClick={() => { setEditingEvent(null); setIsCreating(false); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8">

              {/* ── Basic Information ── */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => update('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Advanced Financial Modeling and Dashboards"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Dates</label>
                    <input
                      type="text"
                      value={editingEvent.dates}
                      onChange={(e) => update('dates', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., March 17-19, 2026"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={editingEvent.duration}
                      onChange={(e) => update('duration', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 3 Days"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                    <input
                      type="text"
                      value={editingEvent.time}
                      onChange={(e) => update('time', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 9:00 AM - 5:00 PM"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={editingEvent.location}
                      onChange={(e) => update('location', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Nairobi, Kenya"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Capacity</label>
                    <input
                      type="text"
                      value={editingEvent.capacity}
                      onChange={(e) => update('capacity', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 25 Participants"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Seats Remaining</label>
                    <input
                      type="number"
                      value={editingEvent.seatsRemaining ?? ''}
                      onChange={(e) => update('seatsRemaining', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Leave empty if TBD"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <select
                      value={editingEvent.category}
                      onChange={(e) => update('category', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option>Finance Services</option>
                      <option>Technology</option>
                      <option>Leadership</option>
                      <option>Business</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingEvent.featured}
                      onChange={(e) => update('featured', e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded"
                    />
                    <span className="text-sm font-semibold text-gray-700">Featured (show urgency badge)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingEvent.published}
                      onChange={(e) => update('published', e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded"
                    />
                    <span className="text-sm font-semibold text-gray-700">Published (visible on website)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingEvent.description}
                    onChange={(e) => update('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter event description..."
                  />
                </div>
              </section>

              {/* ── Payment & Brochure ── */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-primary" />
                  Payment & Brochure
                </h3>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-2">
                  <label className="block text-sm font-bold text-blue-900">
                    Paystack Payment Link
                  </label>
                  <p className="text-xs text-blue-700">When clients click "Register", they will be redirected to this URL to complete payment on Paystack.</p>
                  <input
                    type="url"
                    value={editingEvent.paymentLink}
                    onChange={(e) => update('paymentLink', e.target.value)}
                    className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm"
                    placeholder="https://paystack.com/pay/your-event-link"
                  />
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 space-y-3">
                  <label className="block text-sm font-bold text-purple-900">
                    Event Brochure
                  </label>
                  <p className="text-xs text-purple-700">Upload any file (PDF, image, video, etc.) or paste a shareable link. Clients can view/download it from the event page.</p>

                  {/* File Upload Button */}
                  <label className="block cursor-pointer">
                    <div className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg transition-all text-sm font-medium ${uploadingBrochure ? 'border-purple-300 bg-purple-100 text-purple-400 cursor-wait' : 'border-purple-300 hover:border-purple-500 hover:bg-purple-100 text-purple-700 cursor-pointer'}`}>
                      <Upload className="w-4 h-4" />
                      <span>{uploadingBrochure ? 'Uploading...' : 'Click to upload brochure file'}</span>
                    </div>
                    <input
                      type="file"
                      accept="*/*"
                      className="hidden"
                      disabled={uploadingBrochure}
                      onChange={handleBrochureFileUpload}
                    />
                  </label>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span>or paste a link</span>
                    <div className="flex-1 h-px bg-gray-300" />
                  </div>

                  <input
                    type="url"
                    value={editingEvent.brochureUrl}
                    onChange={(e) => update('brochureUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white text-sm"
                    placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view"
                  />
                  {editingEvent.brochureUrl && (
                    <a
                      href={editingEvent.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-purple-700 hover:text-purple-900 underline"
                    >
                      <FileText className="w-3 h-3" /> Preview brochure
                    </a>
                  )}
                </div>
              </section>

              {/* ── Learning Outcomes ── */}
              <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h3 className="text-lg font-bold text-gray-900">Learning Outcomes</h3>
                  <button
                    onClick={() => update('outcomes', [...editingEvent.outcomes, ''])}
                    className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Outcome
                  </button>
                </div>
                {editingEvent.outcomes.map((outcome, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) => updateOutcome(i, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={`Outcome ${i + 1}`}
                    />
                    <button
                      onClick={() => update('outcomes', editingEvent.outcomes.filter((_, idx) => idx !== i))}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </section>

              {/* ── Who Should Attend ── */}
              <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h3 className="text-lg font-bold text-gray-900">Who Should Attend</h3>
                  <button
               