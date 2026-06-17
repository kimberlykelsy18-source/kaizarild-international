import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router';
import { industries } from '../data/industries';

export default function IndustriesMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const openTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    openTimerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <div 
      className="relative" 
      ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button 
        onClick={toggleMenu}
        className="text-gray-700 hover:text-primary transition-colors flex items-center gap-1 py-2 font-medium text-sm xl:text-base"
        aria-expanded={isOpen}
      >
        Solutions
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="fixed left-0 right-0 top-[64px] md:top-[80px] bg-white shadow-md border-b border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div className="max-w-[1600px] mx-auto px-6 py-8">
            <div className="flex gap-12 items-start">
              {/* Left: Industries */}
              <div className="flex-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-5 px-2">
                  Industry Solutions
                </h3>
                <div className="grid grid-cols-4 gap-x-4 gap-y-3">
                  {industries.map((industry) => (
                    <Link
                      key={industry.id}
                      to={`/industries/${industry.id}`}
                      onClick={() => setIsOpen(false)}
                      className="group text-left px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 group-hover:text-primary transition-colors text-[15px]">
                        {industry.name}
                      </div>
                      <div className="text-[13px] text-gray-500 mt-0.5">
                        {industry.subCategories.length} programs
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right: Promotional Image */}
              <div className="w-[340px] flex-shrink-0">
                <div className="relative rounded-xl overflow-hidden h-[180px] shadow-sm border border-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1720700126957-769e2f2fc0fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYnVzaW5lc3MlMjBwcm9mZXNzaW9uYWxzJTIwdGVhbSUyMGNvbGxhYm9yYXRpb258ZW58MXx8fHwxNzcyMDM5NzU2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Professional Training Solutions"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h4 className="font-semibold text-[17px] mb-1.5 leading-snug">
                      Transform Your Team's Performance
                    </h4>
                    <p className="text-[13px] text-white/90 leading-relaxed">
                      Industry-specific training designed for real business impact
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}