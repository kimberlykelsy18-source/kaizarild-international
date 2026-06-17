import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Pencil, Trash2, Save, X, LogOut, LayoutDashboard, FileText, Settings, Image as ImageIcon, CheckCircle2, Circle } from 'lucide-react';
import { blogApi, Blog, supabase } from '../utils/blogApi'; 
import { projectId } from '../utils/supabase/info'; 
import { toast } from 'sonner';
import { Button } from '../components/ui/button';

export default function AdminBlog() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image: '',
    readTime: '5 min read',
    published: true
  });
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [managerName, setManagerName] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session) loadData();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadData();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadData() {
    try {
      const [blogsData, catsData] = await Promise.all([
        blogApi.getBlogs(),
        blogApi.getCategories()
      ]);
      setBlogs(blogsData);
      setCategories(catsData);
      if (!currentBlog.category && catsData.length > 0) {
        setCurrentBlog(prev => ({ ...prev, category: catsData[0] }));
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message);
    else toast.success('Welcome back!');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: managerName })
      });
      const data = await res.json();
      if (data.error) toast.error(data.error);
      else {
        toast.success('Account created! Please sign in.');
        setIsRegistering(false);
      }
    } catch (err) {
      toast.error("Signup failed. Please contact admin.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    toast.success('Logged out');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    try {
      const saved = await blogApi.saveBlog(currentBlog, session.access_token);
      if (saved) {
        toast.success(currentBlog.id ? 'Article updated' : 'Article published');
        setIsEditing(false);
        setCurrentBlog({
          title: '',
          excerpt: '',
          content: '',
          category: categories[0] || 'General',
          image: '',
          readTime: '5 min read',
          published: true
        });
        loadData();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!session || !confirm('Are you sure? This cannot be undone.')) return;
    try {
      await blogApi.deleteBlog(id, session.access_token);
      toast.success('Article removed');
      loadData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const seedInitialData = async () => {
    if (!session) return;
    const seeds = [
      {
        title: "The 2026 Leadership Paradigm in Africa",
        excerpt: "Why traditional management is failing and how agile leadership is driving growth.",
        content: "The landscape of corporate leadership in Africa is rapidly evolving. Companies are no longer looking for 'command-and-control' managers but for adaptive leaders who can navigate uncertainty...\n\nIn our recent training sessions with regional banks, we've observed that high-emotional intelligence (EQ) is becoming the single most important predictor of executive success.",
        category: "Leadership",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1000",
        published: true
      }
    ];
    try {
      for (const s of seeds) {
        await blogApi.saveBlog(s, session.access_token);
      }
      loadData();
      toast.success("Initial content seeded!");
    } catch (err) {
      toast.error("Seeding failed");
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Authenticating...</div>;

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Manager Portal</h2>
            <p className="text-gray-500 mt-2">
              {isRegistering ? 'Register your manager account' : 'Sign in to manage the knowledge hub'}
            </p>
          </div>

          <form onSubmit={isRegistering ? handleSignup : handleLogin} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-6 text-lg">
              {isRegistering ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full mt-6 text-sm text-primary font-semibold hover:underline"
          >
            {isRegistering ? 'Already have an account? Log in' : 'New collaborator? Register here'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 hidden lg:flex flex-col">
        <div className="mb-10">
          <h1 className="text-xl font-bold text-secondary">Kaizari LD</h1>
          <p className="text-xs text-gray-400">Content Console</p>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-sm font-medium">
            <FileText className="w-4 h-4" />
            Articles
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-sm font-medium text-gray-400">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
              <p className="text-gray-500">Publish and manage insights for your audience.</p>
            </div>
            {!isEditing && (
              <div className="flex gap-2">
                {blogs.length === 0 && (
                  <Button variant="outline" onClick={seedInitialData}>Seed Content</Button>
                )}
                <Button onClick={() => setIsEditing(true)} className="bg-primary">
                  <Plus className="w-4 h-4 mr-2" /> New Post
                </Button>
              </div>
            )}
          </header>

          {isEditing ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {currentBlog.id ? 'Edit Article' : 'Compose New Article'}
                </h3>
                <button onClick={() => { setIsEditing(false); setCurrentBlog({ published: true }); }}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                        value={currentBlog.title}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                      <select
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-primary"
                        value={currentBlog.category}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, category: e.target.value })}
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="url"
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
                          value={currentBlog.image}
                          onChange={(e) => setCurrentBlog({ ...currentBlog, image: e.target.value })}
                          placeholder="Unsplash URL recommended"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none resize-none"
                        value={currentBlog.excerpt}
                        onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-4">
                      <button 
                        type="button"
                        onClick={() => setCurrentBlog({ ...currentBlog, published: !currentBlog.published })}
                        className="flex items-center gap-2 text-sm font-medium"
                      >
                        {currentBlog.published ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                        Publish immediately
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
                  <textarea
                    rows={12}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none font-serif text-lg"
                    value={currentBlog.content}
                    onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-50">
                  <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit" className="bg-primary">Save Article</Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {blogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-4 text-sm font-bold text-gray-600">Article</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-600">Category</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-600">Status</th>
                        <th className="px-6 py-4 text-sm font-bold text-gray-600 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {blogs.map((blog) => (
                        <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <img src={blog.image || blog.imageUrl} className="w-full h-full object-cover" />
                              </div>
                              <div className="max-w-xs">
                                <p className="font-bold text-gray-900 truncate">{blog.title}</p>
                                <p className="text-xs text-gray-500">Created: {new Date(blog.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {blog.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold ${blog.published ? 'text-green-600' : 'text-amber-600'}`}>
                              {blog.published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => { setCurrentBlog(blog); setIsEditing(true); }}
                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(blog.id)}
                                className="p-2 text-red-500 hover:bg-red-50/50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-20 text-center">
                  <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-500 mb-8">Ready to share your expertise with the world?</p>
                  <Button onClick={() => setIsEditing(true)} className="bg-primary">
                    Create Your First Post
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
