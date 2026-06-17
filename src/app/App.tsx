import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTracker from './components/PageTracker';
import UrgencyMarquee from './components/UrgencyMarquee';
import AdminGuard from './components/AdminGuard';
import '../styles/animations.css';

// Import CaseStudies directly (not lazy) to fix dynamic import error
import CaseStudies from './pages/CaseStudies';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const OpenCourseEvents = lazy(() => import('./pages/OpenCourseEvents'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const PartnerHub = lazy(() => import('./pages/PartnerHub'));
const LMSDemo = lazy(() => import('./pages/LMSDemo'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminSubcategories = lazy(() => import('./pages/admin/AdminSubcategories'));
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents'));
const AdminCaseStudies = lazy(() => import('./pages/admin/AdminCaseStudies'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminDataManagement = lazy(() => import('./pages/admin/AdminDataManagement'));
const AdminContent = lazy(() => import('./pages/admin/AdminContent'));
const IndustrySubcategoryPage = lazy(() => import('./pages/IndustrySubcategoryPage'));
const IndustryPage = lazy(() => import('./pages/IndustryPage'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Main App component - Updated with coming soon subcategories
export default function App() {
  return (
    <Router>
      <PageTracker />
      <div className="min-h-screen flex flex-col">
        <UrgencyMarquee />
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/open-course-events" element={<OpenCourseEvents />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/partner-hub" element={<PartnerHub />} />
              <Route path="/lms-demo" element={<LMSDemo />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPostDetail />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/blog" element={<AdminGuard><AdminBlog /></AdminGuard>} />
              <Route path="/admin/subcategories" element={<AdminGuard><AdminSubcategories /></AdminGuard>} />
              <Route path="/admin/events" element={<AdminGuard><AdminEvents /></AdminGuard>} />
              <Route path="/admin/case-studies" element={<AdminGuard><AdminCaseStudies /></AdminGuard>} />
              <Route path="/admin/data-management" element={<AdminGuard><AdminDataManagement /></AdminGuard>} />
              <Route path="/admin/content" element={<AdminGuard><AdminContent /></AdminGuard>} />
              <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/industries/:industryId/:subcategorySlug" element={<IndustrySubcategoryPage />} />
              <Route path="/industries/:industryId" element={<IndustryPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}