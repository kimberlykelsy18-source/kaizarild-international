import { useState, useEffect } from 'react';
import { X, Monitor } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from './ui/button';

export default function LMSPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show popup after scrolling 50% of the page, but not if dismissed
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercentage > 50 && !isDismissed) {
        setIsVisible(true);
      }
    };

    // Check if user has dismissed popup in this session
    const dismissed = sessionStorage.getItem('lms-popup-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    } else {
      window.addEventListener('scroll', handleScroll);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('lms-popup-dismissed', 'true');
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-fade-in-up">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-primary p-6 max-w-sm relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="bg-secondary/10 p-3 rounded-lg flex-shrink-0">
            <Monitor className="w-6 h-6 text-secondary" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">
              Explore Our LMS Platform
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Perfect for budget-conscious teams or those seeking self-paced learning. Book a free demo today!
            </p>
            
            <Link to="/lms-demo" onClick={handleDismiss}>
              <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                Book Free Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
