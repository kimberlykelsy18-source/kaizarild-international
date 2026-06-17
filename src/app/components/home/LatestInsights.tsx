import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Button } from '../ui/button';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
  status: string;
}

export default function LatestInsights() {
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetchLatest();
  }, []);

  const fetchLatest = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d/blogs`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setLatestBlogs(data.filter(b => b.status === 'published').slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching latest blogs:", error);
    }
  };

  if (latestBlogs.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest <span className="text-secondary">Insights</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Expert advice and industry news to help you navigate the ever-changing landscape of professional development.
            </p>
          </div>
          <Link to="/blog">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white group">
              View All Articles
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {latestBlogs.map((blog) => (
            <Link 
              key={blog.id} 
              to={`/blog/${blog.id}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    {blog.category}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(blog.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {blog.author.split('@')[0]}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {blog.title}
              </h3>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {blog.excerpt}
              </p>
              
              <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm">
                Read Article
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}