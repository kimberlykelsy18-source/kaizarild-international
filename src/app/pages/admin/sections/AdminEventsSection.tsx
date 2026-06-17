import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { supabase } from '../../../utils/supabase/client';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X, Link2, FileText, Upload } from 'lucide-react';
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
  benefits: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d`;
const MASTER_KEY = 'KAIZARI_ADMIN_2026';

export default function AdminEventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE}/events`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` },
      });
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
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
      benefits: [''],
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
    try {
      const url = isCreating
        ? `${API_BASE}/events`
        : `${API_BASE}/events/${editingEvent.id}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...editingEvent, updatedAt: new Date().toISOString() }),
      });
      if (!response.ok) throw new Error('Failed to save event');
      toast.success(isCreating ? 'Event created!' : 'Event updated!');
      setEditingEvent(null);
      setIsCreating(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    try {
      const response = await fetch(`${API_BASE}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
        },
      });
      if (!response.ok) throw new Error('Failed to delete event');
      toast.success('Event deleted');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleTogglePublished = async (event: Event) => {
    try {
      const response = await fetch(`${API_BASE}/events/${event.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...event, published: !event.published }),
      });
      if (!response.ok) throw new Error('Failed to update event');
      toast.success(event.published ? 'Event unpublished' : 'Event published');
      fetchEvents();
    } catch (error) {
      console.error('Error toggling published status:', error);
      toast.error('Failed to update event');
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
      setEditingEvent((prev) => prev ? { ...prev, brochureUrl: publicUrl } : prev);
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

  const updateBenefit = (i: number, val: string) => {
    if (!editingEvent) return;
    const arr = [...(editingEvent.benefits || [])];
    arr[i] = val;
    update('benefits', arr);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading events...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
          <p className="text-gray-600 mt-1">Manage open course events and registrations</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No events yet</p>
          <button onClick={handleCreate} className="text-orange-600 hover:underline font-semibold">
            Create your first event
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                    {event.featured && (
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">FEATURED</span>
                    )}
                    {event.published ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Draft
                      </span>
                    )}
                    {event.paymentLink && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                        <Link2 className="w-3 h-3" /> Payment set
                      </span>
                    )}
                    {event.brochureUrl && (
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Brochure set
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div><span className="font-semibold">Dates:</span> {event.dates || '—'}</div>
                    <div><span className="font-semibold">Duration:</span> {event.duration || '—'}</div>
                    <div><span className="font-semibold">Location:</span> {event.location || '—'}</div>
                    <div><span className="font-semibold">Category:</span> {event.category || '—'}</div>
                  </div>
                  <p className="text-gray-700 line-clamp-2">{event.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <button
                    onClick={() => handleTogglePublished(event)}
                    className={`p-2 rounded-lg border-2 transition-all ${event.published ? 'border-green-200 bg-green-50 hover:bg-green-100 text-green-700' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
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

      {/* Edit / Create Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8">

            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {isCreating ? 'Create Event' : 'Edit Event'}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., March 17-19, 2026"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={editingEvent.duration}
                      onChange={(e) => update('duration', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., 3 Days"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                    <input
                      type="text"
                      value={editingEvent.time}
                      onChange={(e) => update('time', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., 9:00 AM - 5:00 PM"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={editingEvent.location}
                      onChange={(e) => update('location', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Nairobi, Kenya"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Capacity</label>
                    <input
                      type="text"
                      value={editingEvent.capacity}
                      onChange={(e) => update('capacity', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., 25 Participants"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Seats Remaining</label>
                    <input
                      type="number"
                      value={editingEvent.seatsRemaining ?? ''}
                      onChange={(e) => update('seatsRemaining', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Leave blank if not applicable"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={editingEvent.category}
                    onChange={(e) => update('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option>Finance Services</option>
                    <option>Leadership & Management</option>
                    <option>Human Resources</option>
                    <option>Sales & Marketing</option>
                    <option>Operations</option>
                    <option>Technology</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingEvent.featured}
                      onChange={(e) => update('featured', e.target.checked)}
                      className="w-4 h-4 accent-orange-600"
                    />
                    <span className="text-sm font-semibold text-gray-700">Featured Event</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingEvent.published}
                      onChange={(e) => update('published', e.target.checked)}
                      className="w-4 h-4 accent-orange-600"
                    />
                    <span className="text-sm font-semibold text-gray-700">Published</span>
                  </label>
                </div>
              </section>

              {/* ── Description ── */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Description</h3>
                <textarea
                  value={editingEvent.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
                  placeholder="Describe the event, what attendees will gain, etc."
                />
              </section>

              {/* ── Learning Outcomes ── */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Learning Outcomes</h3>
                {editingEvent.outcomes.map((outcome, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) => updateOutcome(i, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={`Outcome ${i + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => update('outcomes', editingEvent.outcomes.filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => update('outcomes', [...editingEvent.outcomes, ''])}
                  className="text-orange-600 hover:underline text-sm font-semibold"
                >
                  + Add Outcome
                </button>
              </section>

              {/* ── Who Should Attend ── */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Who Should Attend</h3>
                {editingEvent.whoShouldAttend.map((attendee, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={attendee}
                      onChange={(e) => updateAttendee(i, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={`Audience ${i + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => update('whoShouldAttend', editingEvent.whoShouldAttend.filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => update('whoShouldAttend', [...editingEvent.whoShouldAttend, ''])}
                  className="text-orange-600 hover:underline text-sm font-semibold"
                >
                  + Add Audience
                </button>
              </section>

              {/* ── What's Included (Benefits) ── */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-green-200 pb-2 text-green-800">
                  What's Included
                </h3>
                <p className="text-xs text-gray-500">These appear on the event card beside each course (e.g. "Certificate of Completion", "Live sessions via Zoom"). Tailor per event type.</p>
                {(editingEvent.benefits || []).map((benefit, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => updateBenefit(i, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={`e.g. Certificate of Completion`}
                    />
                    <button
                      type="button"
                      onClick={() => update('benefits', (editingEvent.benefits || []).filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => update('benefits', [...(editingEvent.benefits || []), ''])}
                  className="text-orange-600 hover:underline text-sm font-semibold"
                >
                  + Add Item
                </button>
              </section>

              {/* ── Paystack Payment Link ── */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-blue-200 pb-2 text-blue-800">
                  <Link2 className="inline w-5 h-5 mr-2" />
                  Paystack Payment Link
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-blue-800 mb-1">
                    Payment Link URL
                  </label>
                  <input
                    type="url"
                    value={editingEvent.paymentLink}
                    onChange={(e) => update('paymentLink', e.target.value)}
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://paystack.com/pay/your-event-link"
                  />
                  <p className="text-xs text-blue-600 mt-2">
                    When set, the "Register" button will redirect attendees to this Paystack payment page.
                  </p>
                </div>
              </section>

              {/* ── Brochure Upload ── */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-purple-200 pb-2 text-purple-800">
                  <FileText className="inline w-5 h-5 mr-2" />
                  Event Brochure
                </h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-2">
                      Upload Brochure File
                    </label>
                    <label className={`flex items-center gap-3 cursor-pointer border-2 border-dashed rounded-lg p-4 transition-colors ${uploadingBrochure ? 'border-purple-300 bg-purple-100 opacity-70' : 'border-purple-300 hover:border-purple-500 hover:bg-purple-100'}`}>
                      <Upload className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <span className="text-sm text-purple-700 font-medium">
                        {uploadingBrochure ? 'Uploading...' : 'Click to upload any file (PDF, image, video, etc.)'}
                      </span>
                      <input
                        type="file"
                        accept="*/*"
                        className="hidden"
                        disabled={uploadingBrochure}
                        onChange={handleBrochureFileUpload}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-800 mb-1">
                      Or paste a URL directly
                    </label>
                    <input
                      type="url"
                      value={editingEvent.brochureUrl}
                      onChange={(e) => update('brochureUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                  {editingEvent.brochureUrl && (
                    <p className="text-xs text-purple-600">
                      Current: <a href={editingEvent.brochureUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-800">{editingEvent.brochureUrl}</a>
                    </p>
                  )}
                </div>
              </section>

            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => { setEditingEvent(null); setIsCreating(false); }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-all"
              >
                <X className="inline w-4 h-4 mr-1" /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                {isCreating ? 'Create Event' : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
