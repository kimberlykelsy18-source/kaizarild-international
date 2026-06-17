import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, User, Tag as TagIcon, Share2 } from 'lucide-react';
import { blogApi, Blog as BlogType } from '../utils/blogApi';
import { Button } from '../components/ui/button';

export default function BlogPostDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [authorProfile, setAuthorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlog() {
      if (id) {
        const data = await blogApi.getBlog(id);
        if (data) {
          setBlog(data);
          // Load author profile dynamically
          if (data.authorId) {
            const profile = await blogApi.getProfile(data.authorId);
            setAuthorProfile(profile);
          }
        }
        setLoading(false);
      }
    }
    loadBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8">The article you're looking for might have been moved or removed.</p>
        <Link to="/blog">
          <Button className="bg-primary hover:bg-primary/90">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-white min-h-screen">
      {/* Hero Section */}
      <header className="relative h-[60vh] min-h-[400px] w-full">
        <img
          src={blog.image || `https://images.unsplash.com/photo-1454165833767-13143895996b?auto=format&fit=crop&q=80&w=1600`}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)' }} />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Blog
            </Link>
            <div className="space-y-4">
              <span className="inline-block bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                {blog.category}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-secondary" />
                  <span>By {blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <main className="lg:flex-1">
            <div className="prose prose-lg max-w-none prose-primary prose-headings:text-gray-900 prose-p:text-gray-600 prose-img:rounded-2xl prose-strong:text-gray-900">
              <div 
                className="quill-content text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content || '' }} 
              />
              
              <style>{`
                .quill-content h1 { font-size: 2.25rem; font-weight: 700; margin-bottom: 1.5rem; color: #111827; }
                .quill-content h2 { font-size: 1.875rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; color: #111827; }
                .quill-content h3 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #111827; }
                .quill-content p { margin-bottom: 1.25rem; line-height: 1.8; }
                .quill-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.25rem; }
                .quill-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.25rem; }
                .quill-content blockquote { border-left: 4px solid #F57C00; padding-left: 1.5rem; font-style: italic; margin: 2rem 0; color: #4B5563; }
                .quill-content img { border-radius: 0.75rem; margin: 2rem 0; max-width: 100%; height: auto; }
                .quill-content a { color: #F57C00; text-decoration: underline; font-weight: 500; }
                .quill-content .ql-align-center { text-align: center; }
                .quill-content .ql-align-right { text-align: right; }
                .quill-content .ql-align-justify { text-align: justify; }
              `}</style>
            </div>

            {/* Share Section */}
            <div className="mt-16 pt-8 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-gray-900">Share this article:</span>
                </div>
                <div className="flex gap-4">
                  <a href={authorProfile?.socials?.facebook || '#'} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                      <TagIcon className="w-4 h-4" />
                    </Button>
                  </a>
                  <a href={authorProfile?.socials?.twitter || '#'} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-sky-400 hover:text-white transition-colors">
                      <TagIcon className="w-4 h-4" />
                    </Button>
                  </a>
                  <a href={authorProfile?.socials?.linkedin || '#'} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-700 hover:text-white transition-colors">
                      <TagIcon className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-12">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About the Author</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{authorProfile?.name || blog.author}</p>
                  <p className="text-sm text-gray-500">{authorProfile?.role || 'Kaizari LD Contributor'}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {authorProfile?.bio || 'Sharing deep industry expertise to help businesses across East Africa transform through strategic training and development.'}
              </p>
            </div>

            <div className="sticky top-24">
              <div className="bg-primary text-white p-8 rounded-2xl shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <h3 className="text-xl font-bold mb-4 relative z-10">Elevate Your Team</h3>
                <p className="text-white/80 text-sm mb-6 relative z-10">
                  Interested in personalized training programs for your organization?
                </p>
                <Link to="/contact">
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold relative z-10">
                    Talk to an Expert
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}