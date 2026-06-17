import { Link, useNavigate } from 'react-router';
import { FileText, Calendar, Award, FolderOpen, Database, LayoutGrid, LogOut } from 'lucide-react';
import { ADMIN_SESSION_KEY } from './AdminLogin';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    navigate('/admin/login');
  };
  const adminSections = [
    {
      title: 'Content Management',
      description: 'Manage blog posts, events, and case studies in one place',
      icon: LayoutGrid,
      link: '/admin/content',
      color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-700',
    },
    {
      title: 'Industry Training',
      description: 'Manage training content for 103 industry subcategories',
      icon: FolderOpen,
      link: '/admin/subcategories',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700',
    },
    {
      title: 'Data Management',
      description: 'Seed or restore initial events and case studies',
      icon: Database,
      link: '/admin/data-management',
      color: 'bg-pink-50 border-pink-200 hover:bg-pink-100 text-pink-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between gap-4">
          <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage all aspects of your Kaizari LD International website
          </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all text-sm flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.title}
                to={section.link}
                className={`p-8 rounded-xl border-2 transition-all duration-300 hover:shadow-xl ${section.color}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white/50">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                    <p className="text-sm opacity-80">{section.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-xl border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/blog"
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all text-center"
            >
              <div className="text-sm text-gray-600 mb-1">View</div>
              <div className="text-lg font-bold text-gray-900">Blog</div>
            </Link>
            <Link
              to="/open-course-events"
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all text-center"
            >
              <div className="text-sm text-gray-600 mb-1">View</div>
              <div className="text-lg font-bold text-gray-900">Events</div>
            </Link>
            <Link
              to="/case-studies"
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all text-center"
            >
              <div className="text-sm text-gray-600 mb-1">View</div>
              <div className="text-lg font-bold text-gray-900">Case Studies</div>
            </Link>
            <Link
              to="/"
              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all text-center"
            >
              <div className="text-sm text-gray-600 mb-1">View</div>
              <div className="text-lg font-bold text-gray-900">Homepage</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}