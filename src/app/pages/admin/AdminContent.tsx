import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronLeft, FileText, Calendar, Award, Megaphone, Image } from 'lucide-react';
import AdminBlogSection from './sections/AdminBlogSection';
import AdminEventsSection from './sections/AdminEventsSection';
import AdminCaseStudiesSection from './sections/AdminCaseStudiesSection';
import AdminMarqueeSection from './sections/AdminMarqueeSection';
import AdminLogosSection from './sections/AdminLogosSection';

type TabType = 'blog' | 'events' | 'case-studies' | 'marquee' | 'logos';

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<TabType>('blog');

  const tabs = [
    {
      id: 'blog' as TabType,
      label: 'Blog Posts',
      icon: FileText,
      activeColor: 'bg-blue-50 border-blue-200 text-blue-700',
      inactiveColor: 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50',
    },
    {
      id: 'events' as TabType,
      label: 'Events',
      icon: Calendar,
      activeColor: 'bg-orange-50 border-orange-200 text-orange-700',
      inactiveColor: 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50',
    },
    {
      id: 'case-studies' as TabType,
      label: 'Case Studies',
      icon: Award,
      activeColor: 'bg-green-50 border-green-200 text-green-700',
      inactiveColor: 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50',
    },
    {
      id: 'marquee' as TabType,
      label: 'Announcement Banner',
      icon: Megaphone,
      activeColor: 'bg-purple-50 border-purple-200 text-purple-700',
      inactiveColor: 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50',
    },
    {
      id: 'logos' as TabType,
      label: 'Client Logos',
      icon: Image,
      activeColor: 'bg-teal-50 border-teal-200 text-teal-700',
      inactiveColor: 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-2">
            Manage blog posts, events, case studies, and the announcement banner
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg border-2 font-semibold flex items-center gap-2 transition-all ${
                  isActive ? tab.activeColor : tab.inactiveColor
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'blog' && <AdminBlogSection />}
          {activeTab === 'events' && <AdminEventsSection />}
          {activeTab === 'case-studies' && <AdminCaseStudiesSection />}
          {activeTab === 'marquee' && <AdminMarqueeSection />}
          {activeTab === 'logos' && <AdminLogosSection />}
        </div>
      </div>
    </div>
  );
}
