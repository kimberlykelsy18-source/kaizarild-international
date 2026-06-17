import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { Save, Eye, EyeOff, Megaphone } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d`;
const MASTER_KEY = 'KAIZARI_ADMIN_2026';

interface MarqueeSettings {
  enabled: boolean;
  message: string;
  variant: 'urgent' | 'info';
}

export default function AdminMarqueeSection() {
  const [settings, setSettings] = useState<MarqueeSettings>({
    enabled: false,
    message: '',
    variant: 'urgent',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/marquee`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
    })
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => toast.error('Failed to load marquee settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings.message.trim() && settings.enabled) {
      toast.error('Please enter a message before enabling the banner');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/marquee`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Marquee banner updated!');
    } catch {
      toast.error('Failed to save marquee settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const previewBg =
    settings.variant === 'urgent'
      ? 'linear-gradient(to right, #f57c00, #ea580c, #f57c00)'
      : 'linear-gradient(to right, #005A7C, #007BA3, #005A7C)';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Announcement Banner</h2>
          <p className="text-gray-600 mt-1">Scrolling marquee displayed at the very top of every page</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Live Preview */}
      {settings.message.trim() && (
        <div className="rounded-xl overflow-hidden border-2 border-gray-200">
          <p className="text-xs font-semibold text-gray-500 px-3 py-1 bg-gray-50">PREVIEW</p>
          <div style={{ background: previewBg }} className="text-white py-2.5 overflow-hidden">
            <div className="flex items-center gap-3 px-6 whitespace-nowrap">
              <Megaphone className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold text-sm tracking-wide">{settings.message}</span>
              <Megaphone className="w-4 h-4 flex-shrink-0" />
              <span className="mx-6 text-white/40">•</span>
              <Megaphone className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold text-sm tracking-wide">{settings.message}</span>
              <Megaphone className="w-4 h-4 flex-shrink-0" />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">

        {/* Enable / Disable */}
        <div className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200">
          <div>
            <p className="font-semibold text-gray-900">Banner Status</p>
            <p className="text-sm text-gray-500">Toggle the banner on or off sitewide</p>
          </div>
          <button
            onClick={() => setSettings((s) => ({ ...s, enabled: !s.enabled }))}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold border-2 transition-all ${
              settings.enabled
                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {settings.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {settings.enabled ? 'Visible' : 'Hidden'}
          </button>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Banner Message
          </label>
          <textarea
            rows={3}
            value={settings.message}
            onChange={(e) => setSettings((s) => ({ ...s, message: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-y"
            placeholder="e.g. FILLING FAST: Advanced Financial Modeling (June 20th-22nd) — Only 8 Seats Left! Register Now."
          />
        </div>

        {/* Variant */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Banner Style</label>
          <div className="flex gap-4">
            <button
              onClick={() => setSettings((s) => ({ ...s, variant: 'urgent' }))}
              className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all ${
                settings.variant === 'urgent'
                  ? 'border-orange-400 bg-orange-50 text-orange-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              🔴 Urgent / Promotional
            </button>
            <button
              onClick={() => setSettings((s) => ({ ...s, variant: 'info' }))}
              className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all ${
                settings.variant === 'info'
                  ? 'border-blue-400 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              🔵 Informational
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
