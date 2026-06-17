import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Edit2, Trash2, Save, X, LayoutDashboard, LogOut, FileText, Image as ImageIcon, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  status: 'published' | 'draft';
}

export default function BlogAdmin() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({
    title: '',
    excerpt: '',
    content: '',
    category: 'General',
    status: 'draft',
    imageUrl: 'https://images.unsplash.com/photo-1764690690771-b4522d66b433'
  });

  const [authForm, setAuthForm] = useState({ email: '', password: '' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchBlogs();
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchBlogs();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d/blogs`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await response.json();
      if (Array.isArray(data)) setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: authForm.email,
      password: authForm.password,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  const handleSave = async () => {
    if (!currentBlog.title || !currentBlog.content) {
      toast.error("Please fill in the title and content");
      return;
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(currentBlog)
      });

      if (response.ok) {
        toast.success(currentBlog.id ? "Blog updated!" : "Blog published!");
        setIsEditing(false);
        fetchBlogs();
      } else {
        toast.error("Failed to save blog");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (response.ok) {
        toast.success("Blog deleted");
        fetchBlogs();
      }
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Collaborator Access</h2>
            <p className="text-gray-500 mt-2">Sign in to manage blog content</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                placeholder="admin@kaizarildinternational.com"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                placeholder="••••••••"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12 text-lg">
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            For access requests, contact the IT department.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-500">Manage your company's insights and news</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => {
                setCurrentBlog({
                  title: '',
                  excerpt: '',
                  content: '',
                  category: 'General',
                  status: 'draft',
                  imageUrl: 'https://images.unsplash.com/photo-1764690690771-b4522d66b433'
                });
                setIsEditing(true);
              }}
              className="bg-secondary hover:bg-secondary/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Article
            </Button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {currentBlog.id ? 'Edit Article' : 'Compose New Article'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                      placeholder="Enter article title..."
                      value={currentBlog.title}
                      onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none bg-white"
                        value={currentBlog.category}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, category: e.target.value })}
                      >
                        <option>General</option>
                        <option>Finance</option>
                        <option>Leadership</option>
                        <option>Technology</option>
                        <option>Soft Skills</option>
                        <option>LMS</option>
                        <option>Strategy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none bg-white"
                        value={currentBlog.status}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, status: e.target.value as any })}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                        placeholder="https://..."
                        value={currentBlog.imageUrl}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, imageUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt</label>
                  <textarea
                    rows={8}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none resize-none"
                    placeholder="Short summary for the listing page..."
                    value={currentBlog.excerpt}
                    onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
                <textarea
                  rows={15}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none font-mono text-sm"
                  placeholder="Write your article here..."
                  value={currentBlog.content}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave} className="bg-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                {currentBlog.id ? 'Save Changes' : 'Publish Article'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <div key={blog.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
                  <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={blog.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {blog.status}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">{blog.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 truncate mb-1">{blog.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{blog.excerpt}</p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                      <span>Updated: {new Date(blog.date).toLocaleDateString()}</span>
                      <span>By: {blog.author.split('@')[0]}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 md:flex-none"
                      onClick={() => {
                        setCurrentBlog(blog);
                        setIsEditing(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 md:flex-none text-red-600 hover:bg-red-50 hover:text-red-700 border-red-100"
                      onClick={() => handleDelete(blog.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">No blog posts yet</h3>
                <p className="text-gray-500 mb-6">Start by creating your first article for the company blog.</p>
                <Button onClick={() => setIsEditing(true)} className="bg-primary">
                  Create First Post
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
