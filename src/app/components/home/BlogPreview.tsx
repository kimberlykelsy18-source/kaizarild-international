import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
}

export default function BlogPreview() {
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
        setLatestBlogs(data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching latest blogs:', error);
    }
  };

  if (latestBlogs.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Insights & <span className="text-primary">Industry News</span>
            </h2>
            <p className="text-lg text-gray-600">
              Stay updated with the latest trends in corporate training and development across East Africa.
            </p>
          </div>
          <Link to="/blog">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              View All Insights
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {latestBlogs.map((blog) => (
            <article key={blog.id} className="group cursor-pointer">
              <Link to={`/blog/${blog.id}`}>
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 shadow-sm">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {blog.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  {new Date(blog.date).toLocaleDateString()}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 line-clamp-2 mb-4">
                  {blog.excerpt}
                </p>
                <span className="inline-flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
                  Read More
                  <ArrowRight className="ml-1 w-4 h-4" />
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}