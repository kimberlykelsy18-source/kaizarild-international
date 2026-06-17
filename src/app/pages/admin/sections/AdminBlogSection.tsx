import { Link } from 'react-router';
import { ExternalLink } from 'lucide-react';

export default function AdminBlogSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Management</h2>
      <p className="text-gray-600 mb-8">
        The blog management system has its own dedicated interface with advanced editing features.
      </p>
      <Link
        to="/admin/blog"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
      >
        Open Blog Admin
        <ExternalLink className="w-5 h-5" />
      </Link>
    </div>
  );
}
