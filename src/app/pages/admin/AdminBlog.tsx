import { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, LayoutDashboard, LogOut, Settings, Image as ImageIcon, User, Facebook, Twitter, Linkedin } from 'lucide-react';
import { blogApi, Blog } from '../../utils/blogApi';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabase/client';

const ReactQuill = lazy(() => import('react-quill'));

export default function AdminBlog() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    role: 'Kaizari LD Contributor',
    bio: '',
    socials: { facebook: '', twitter: '', linkedin: '' }
  });

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'align'
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadData();
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadData();
        loadProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(uid: string) {
    const p = await blogApi.getProfile(uid);
    if (p) {
      setProfile(p);
    } else if (session) {
      setProfile(prev => ({ ...prev, name: session.user.user_metadata?.name || '' }));
    }
  }

  async function loadData() {
    const [blogsData, catsData] = await Promise.all([
      blogApi.getBlogs(),
      blogApi.getCategories()
    ]);
    setBlogs(blogsData);
    setCategories(catsData);
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') as string).trim();
    const password = formData.get('password') as string;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      toast.error(`Login failed: ${error.message}`);
    } else {
      toast.success('Welcome back!');
      await loadData();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const handleSaveProfile = async () => {
    if (!session) return;
    try {
      await blogApi.saveProfile(session.user.id, profile, session.access_token);
      setIsProfileEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    const token = currentSession?.access_token || '';
    
    const blogToSave = {
      ...editingBlog,
      author: profile.name || currentSession?.user?.user_metadata?.name || 'Kaizari Admin',
      authorId: currentSession?.user?.id,
      content: editingBlog.content || '',
      title: editingBlog.title || 'Untitled Article',
      category: editingBlog.category || 'General',
      published: !!editingBlog.published
    };

    const toastId = toast.loading('Syncing with Kaizari Cloud...');

    try {
      await blogApi.saveBlog(blogToSave, token);
      toast.dismiss(toastId);
      toast.success('Published successfully!');
      setEditingBlog(null);
      await loadData();
    } catch (err: any) {
      toast.dismiss(toastId);
      alert(`CRITICAL ERROR\n\n${err.message}`);
    }
  };

  const handleForceLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/admin/blog';
  };

  const handleDeleteBlog = async (id: string) => {
    if (!session || !window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await blogApi.deleteBlog(id, session.access_token);
      toast.success('Article deleted');
      loadData();
    } catch (err) {
      toast.error('Failed to delete article');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory || !session) return;
    try {
      await blogApi.addCategory(newCategory, session.access_token);
      setNewCategory('');
      await loadData();
      toast.success('Category added');
    } catch (err) {
      toast.error('Failed to add category');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <link rel="stylesheet" href="https://unpkg.com/react-quill@2.0.0/dist/quill.snow.css" />
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-600">Please sign in to manage the blog</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input name="email" type="email" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6">Sign In</Button>
          </form>
          <p className="text-center mt-6 text-xs text-gray-500">Authorized personnel only. Credentials are managed by System Admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <link rel="stylesheet" href="https://unpkg.com/react-quill@2.0.0/dist/quill.snow.css" />
      <div className="fixed inset-y-0 left-0 w-64 bg-primary text-white hidden lg:flex flex-col z-50">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-bold text-xl flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-secondary" /> Kaizari Admin
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg text-white font-medium">
            <Settings className="w-5 h-5" /> Blog Management
          </button>
          <button 
            onClick={() => navigate('/admin/subcategories')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-white/70 hover:text-white transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" /> Training Content
          </button>
          <button onClick={() => setIsProfileEditing(true)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-white/70 hover:text-white transition-colors">
            <User className="w-5 h-5" /> Edit Profile
          </button>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </div>

      <main className="lg:pl-64 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">Blog Management</h1>
            <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-700">Active</div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleForceLogout} className="text-xs border-red-200 text-red-600">Reset Session</Button>
            <Button onClick={() => setEditingBlog({ title: '', excerpt: '', content: '', category: categories[0] || 'General', author: profile.name, published: false })} className="bg-secondary text-white">
              <Plus className="w-4 h-4 mr-2" /> New Article
            </Button>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto">
          {/* Profile Quick View */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                {profile.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="font-bold text-gray-900">{profile.name || 'Set Your Name'}</p>
                <p className="text-sm text-gray-500">{profile.role}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsProfileEditing(true)}>Edit Public Profile</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><p className="text-gray-500 text-sm">Total</p><h3 className="text-3xl font-bold">{blogs.length}</h3></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><p className="text-gray-500 text-sm">Published</p><h3 className="text-3xl font-bold text-primary">{blogs.filter(b => b.published).length}</h3></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><p className="text-gray-500 text-sm">Drafts</p><h3 className="text-3xl font-bold text-secondary">{blogs.filter(b => !b.published).length}</h3></div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="font-bold mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2 mb-4">{categories.map(cat => <span key={cat} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{cat}</span>)}</div>
            <div className="flex gap-2 max-w-md">
              <input type="text" placeholder="New category..." className="flex-1 px-4 py-2 border rounded-lg outline-none" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
              <Button onClick={handleAddCategory}>Add</Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm"><tr><th className="px-6 py-4">Article</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={blog.image || 'https://via.placeholder.com/100'} className="w-10 h-10 rounded object-cover" /><div><p className="font-bold text-gray-900">{blog.title}</p><p className="text-xs text-gray-500">by {blog.author}</p></div></div></td>
                    <td className="px-6 py-4 text-sm">{blog.category}</td>
                    <td className="px-6 py-4">{blog.published ? <span className="text-green-600 text-sm flex items-center gap-1"><Eye className="w-4 h-4"/> Published</span> : <span className="text-amber-600 text-sm flex items-center gap-1"><EyeOff className="w-4 h-4"/> Draft</span>}</td>
                    <td className="px-6 py-4 text-right"><button onClick={() => setEditingBlog(blog)} className="p-2 text-primary"><Edit2 className="w-4 h-4"/></button><button onClick={() => handleDeleteBlog(blog.id!)} className="p-2 text-red-600"><Trash2 className="w-4 h-4"/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Profile Modal */}
      {isProfileEditing && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Public Profile</h2>
              <button onClick={() => setIsProfileEditing(false)}><X className="w-6 h-6"/></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm font-medium">Display Name</label><input className="w-full px-4 py-2 border rounded-lg" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} /></div>
              <div><label className="text-sm font-medium">Professional Role</label><input className="w-full px-4 py-2 border rounded-lg" value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} /></div>
              <div><label className="text-sm font-medium">Short Bio</label><textarea rows={3} className="w-full px-4 py-2 border rounded-lg" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} /></div>
              <div className="grid grid-cols-3 gap-2">
                <div><label className="text-xs">Facebook</label><input className="w-full px-3 py-1 border rounded" value={profile.socials.facebook} onChange={e => setProfile({...profile, socials: {...profile.socials, facebook: e.target.value}})} /></div>
                <div><label className="text-xs">Twitter</label><input className="w-full px-3 py-1 border rounded" value={profile.socials.twitter} onChange={e => setProfile({...profile, socials: {...profile.socials, twitter: e.target.value}})} /></div>
                <div><label className="text-xs">LinkedIn</label><input className="w-full px-3 py-1 border rounded" value={profile.socials.linkedin} onChange={e => setProfile({...profile, socials: {...profile.socials, linkedin: e.target.value}})} /></div>
              </div>
              <Button onClick={handleSaveProfile} className="w-full bg-primary text-white mt-4">Save Profile</Button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Editor Modal */}
      {editingBlog && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">{editingBlog.id ? 'Edit' : 'New'} Article</h2><button onClick={() => setEditingBlog(null)}><X className="w-6 h-6"/></button></div>
            <form onSubmit={handleSaveBlog} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div><label className="text-sm font-medium">Title</label><input required className="w-full px-4 py-2 border rounded-lg" value={editingBlog.title} onChange={e => setEditingBlog({...editingBlog, title: e.target.value})} /></div>
                  <div><label className="text-sm font-medium">Category</label><select className="w-full px-4 py-2 border rounded-lg" value={editingBlog.category} onChange={e => setEditingBlog({...editingBlog, category: e.target.value})}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  <div><label className="text-sm font-medium">Image URL</label><input className="w-full px-4 py-2 border rounded-lg" value={editingBlog.image} onChange={e => setEditingBlog({...editingBlog, image: e.target.value})} /></div>
                </div>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium">Excerpt</label><textarea rows={3} className="w-full px-4 py-2 border rounded-lg" value={editingBlog.excerpt} onChange={e => setEditingBlog({...editingBlog, excerpt: e.target.value})} /></div>
                  <div className="flex items-center gap-2 pt-4"><input type="checkbox" checked={editingBlog.published} onChange={e => setEditingBlog({...editingBlog, published: e.target.checked})} /> <label>Publish Article</label></div>
                </div>
              </div>
              <div><label className="text-sm font-medium">Content</label><Suspense fallback={<div>Loading editor...</div>}><ReactQuill theme="snow" value={editingBlog.content || ''} onChange={content => setEditingBlog({...editingBlog, content})} modules={modules} formats={formats} className="h-64 mb-12" /></Suspense></div>
              <div className="flex justify-end gap-4"><Button variant="outline" onClick={() => setEditingBlog(null)}>Cancel</Button><Button type="submit" className="bg-primary text-white">Save Article</Button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}