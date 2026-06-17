// Subcategory content is now managed dynamically via the admin panel
// Visit /admin/subcategories to create and edit content

export interface SubcategoryContent {
  industryId: string;
  subcategorySlug: string;
  heroHeadline?: string;
  heroDescription?: string;
  heroImage?: string;
  overview?: string;
  keyBenefits?: Array<{ title: string; description: string; icon: string }>;
  trainingModules?: Array<{ title: string; description: string; duration?: string }>;
  outcomes?: string[];
  testimonial?: {
    quote: string;
    author: string;
    position: string;
    company: string;
  };
  faqs?: Array<{ question: string; answer: string }>;
}

// This function is deprecated - content is now fetched from the API
export function getSubcategoryContent(industryId: string, subcategorySlug: string): SubcategoryContent | null {
  console.warn('getSubcategoryContent is deprecated. Content should be fetched from the API instead.');
  return null;
}
