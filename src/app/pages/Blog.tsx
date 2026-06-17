import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { blogApi, Blog as BlogType } from '../utils/blogApi';
import { Button } from '../components/ui/button';

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [blogsData, catsData] = await Promise.all([
          blogApi.getBlogs(),
          blogApi.getCategories()
        ]);
        setBlogs(blogsData.filter(b => b.published));
        setCategories(['All', ...catsData]);
      } catch (error) {
        console.error("Error loading blog data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-16 relative overflow-hidden" style={{ backgroundColor: '#005A7C' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Insights & <span className="text-secondary">Knowledge Hub</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Expert perspectives on corporate training, leadership development, and industry trends in East Africa.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles, topics, or insights..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white shadow-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar - Categories */}
          <aside className="lg:w-64 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Categories
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                      selectedCategory === cat 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-secondary/5 p-6 rounded-2xl border border-secondary/10">
              <h4 className="font-bold text-primary mb-2">Expert Contributions</h4>
              <p className="text-sm text-gray-600 mb-4">
                We're always looking for industry leaders to share their perspectives.
              </p>
              <Link to="/contact">
                <Button variant="outline" size="sm" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </aside>

          {/* Blog Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid sm:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-50 rounded-2xl h-96" />
                ))}
              </div>
            ) : filteredBlogs.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-8">
                {filteredBlogs.map((blog) => (
                  <Link key={blog.id} to={`/blog/${blog.id}`} className="group">
                    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col overflow-hidden">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={blog.image || blog.imageUrl || `https://images.unsplash.com/photo-1454165833767-13143895996b?auto=format&fit=crop&q=80&w=800`}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {blog.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {blog.author.split('@')[0]}
                          </span>
                        </div>
                        
                        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {blog.title}
                        </h2>
                        
                        <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                          {blog.excerpt}
                        </p>
                        
                        <div className="mt-auto flex items-center text-primary font-semibold text-sm">
                          Read Full Article
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-3xl">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">No articles found</h3>
                <p className="text-gray-600">Try adjusting your search or category filters.</p>
                <Button 
                  variant="link" 
                  onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                  className="mt-4 text-primary"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}