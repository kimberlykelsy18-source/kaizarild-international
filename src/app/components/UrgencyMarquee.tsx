import { useEffect, useState } from 'react';
import { AlertCircle, Megaphone } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d`;

interface MarqueeSettings {
  enabled: boolean;
  message: string;
  variant: 'urgent' | 'info';
}

export default function UrgencyMarquee() {
  const [settings, setSettings] = useState<MarqueeSettings | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/marquee`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
    })
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => setSettings(null));
  }, []);

  if (!settings || !settings.enabled || !settings.message.trim()) return null;

  const bgColor =
    settings.variant === 'urgent'
      ? 'bg-gradient-to-r from-secondary via-orange-600 to-secondary'
      : 'bg-gradient-to-r from-primary via-[#007BA3] to-primary';

  const Icon = settings.variant === 'urgent' ? AlertCircle : Megaphone;

  return (
    <div className={`${bgColor} text-white py-2.5 overflow-hidden relative`}>
      <div className="marquee-container flex items-center">
        <div className="marquee-content flex items-center gap-4 whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 mx-10">
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold text-sm tracking-wide">
                {settings.message}
              </span>
              <Icon className="w-4 h-4 flex-shrink-0" />
            </div>
          ))}
        </div>
        <div className="marquee-content flex items-center gap-4 whitespace-nowrap" aria-hidden="true">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 mx-10">
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold text-sm tracking-wide">
                {settings.message}
              </span>
              <Icon className="w-4 h-4 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
