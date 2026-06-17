import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { Database, RefreshCw, CheckCircle, AlertCircle, ChevronLeft, Eye, EyeOff, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { supabase } from '../../utils/supabase/client';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-420cbc7d`;
const MASTER_KEY = 'KAIZARI_ADMIN_2026';

export default function AdminDataManagement() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    toast.success('Logged out successfully');
  };

  const handleSeedData = async () => {
    if (!confirm('This will add the Q1 2026 events and initial case studies to the database (only if they don\'t exist). Continue?')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/seed-initial-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to seed data');

      const data = await response.json();
      setResult(data);
      
      if (data.seededEvents > 0 || data.seededCaseStudies > 0) {
        toast.success('Initial data seeded successfully!');
      } else {
        toast.info('Data already exists - no new items added');
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      toast.error('Failed to seed data');
      setResult({ error: true, message: 'Failed to seed data' });
    } finally {
      setLoading(false);
    }
  };

  const handleReseedData = async () => {
    if (!confirm('⚠️ WARNING: This will OVERWRITE the existing Q1 2026 events and initial case studies with the default data. Any changes you made to these specific items will be lost. Continue?')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/reseed-initial-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Kaizari-Auth': MASTER_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to reseed data');

      const data = await response.json();
      setResult(data);
      toast.success('Data re-seeded successfully!');
    } catch (error) {
      console.error('Error re-seeding data:', error);
      toast.error('Failed to reseed data');
      setResult({ error: true, message: 'Failed to reseed data' });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Data Management Portal</h2>
            <p className="text-gray-500 mt-2">Sign in to manage initial data</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6">
              Sign In
            </Button>
          </form>

          <p className="text-center mt-6 text-xs text-gray-500">
            Use the same credentials as the blog admin portal
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Data Management</h1>
          <p className="text-gray-600 mt-2">
            Seed or restore initial data for events and case studies
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">About Initial Data</h3>
              <p className="text-blue-800 mb-3">
                The initial data includes:
              </p>
              <ul className="list-disc list-inside text-blue-800 space-y-1 ml-2">
                <li><strong>3 Q1 2026 Finance Events:</strong> Financial Modeling, Power Query/BI, and Intermediate-Advanced Excel</li>
                <li><strong>2 Case Studies:</strong> ZEP-RE and Multi-Industry Consortium</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Seed Initial Data */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Seed Initial Data</h2>
                <p className="text-sm text-gray-600">Add if not exists</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              This will add the Q1 2026 events and initial case studies to your database <strong>only if they don't already exist</strong>. Safe to run multiple times.
            </p>
            <button
              onClick={handleSeedData}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Seeding...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" />
                  Seed Initial Data
                </>
              )}
            </button>
          </div>

          {/* Re-seed Data */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-orange-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <RefreshCw className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Re-seed Data</h2>
                <p className="text-sm text-orange-600">⚠️ Overwrites existing</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              This will <strong>overwrite</strong> the existing Q1 2026 events and case studies with the default data. Use this to restore the original versions if you made unwanted changes.
            </p>
            <button
              onClick={handleReseedData}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Re-seeding...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Re-seed Data
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className={`mt-8 rounded-lg p-6 border-2 ${
            result.error 
              ? 'bg-red-50 border-red-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start gap-3">
              {result.error ? (
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className={`text-lg font-bold mb-2 ${
                  result.error ? 'text-red-900' : 'text-green-900'
                }`}>
                  {result.error ? 'Error' : 'Success!'}
                </h3>
                <p className={result.error ? 'text-red-800' : 'text-green-800'}>
                  {result.message}
                </p>
                {!result.error && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span><strong>{result.seededEvents || 0}</strong> events added/updated</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span><strong>{result.seededCaseStudies || 0}</strong> case studies added/updated</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              to="/admin/events"
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all text-center font-semibold text-gray-700"
            >
              Manage Events
            </Link>
            <Link
              to="/admin/case-studies"
              className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all text-center font-semibold text-gray-700"
            >
              Manage Case Studies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}