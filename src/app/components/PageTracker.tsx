import { useEffect } from 'react';
import { useLocation } from 'react-router';

const pageTitles: Record<string, string> = {
  '/': 'Home | Kaizari LD International',
  '/open-course-events': 'Open Course Events | Kaizari LD International',
  '/case-studies': 'Case Studies | Success Stories',
  '/about': 'About Us | Our Story & Mission',
  '/contact': 'Contact Us | Get in Touch',
  '/partner-hub': 'Partner Hub | Become a Trainer',
  '/lms-demo': 'LMS Demo | Modern Learning Solutions',
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function PageTracker() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // 1. Handle Page Title
    const title = pageTitles[pathname] || 'Kaizari LD International';
    document.title = title;

    // 2. Handle Scroll (Normal navigation scrolls to top, hash navigation scrolls to element)
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // 3. Trigger GA Page View
    // Standard GA4 gtag sends page_view automatically on history change, 
    // but in some SPA configurations it needs an explicit trigger.
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: pathname,
      });
    }
  }, [pathname, hash]);

  return null;
}
