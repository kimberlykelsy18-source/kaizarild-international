import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { industries } from '../data/industries';
import { Button } from '../components/ui/button';

export default function IndustryPage() {
  const { industryId } = useParams<{ industryId: string }>();
  const industry = industries.find(ind => ind.id === industryId);

  if (!industry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Industry not found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{industry.name}</h1>
          <p className="text-lg text-white/90 max-w-3xl">
            Explore our comprehensive training solutions designed specifically for the {industry.name.toLowerCase()} sector.
          </p>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Training Solutions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industry.subCategories.map((subCategory, index) => {
            const slug = subCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return (
              <Link
                key={index}
                to={`/industries/${industryId}/${slug}`}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2">
                    {subCategory.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {subCategory.description || `Comprehensive training in ${subCategory.name.toLowerCase()} tailored for the ${industry.name.toLowerCase()} industry.`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We can tailor our training programs to meet your organization's specific needs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={`https://wa.me/254713955653?text=I'm interested in ${industry.name} training solutions`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Request In-House Training
              </Button>
            </a>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
