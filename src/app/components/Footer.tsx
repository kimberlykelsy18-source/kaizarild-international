import { Link } from 'react-router';
import { Mail, Phone, MapPin, Linkedin, Facebook } from 'lucide-react';
import logoGold from 'figma:asset/0b6ae337336e83091b49c86ad967e0194f344223.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img 
                src={logoGold}
                alt="Kaizari LD International" 
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Premium corporate training and consulting solutions across East Africa. 
              Delivering measurable ROI through strategic learning and development.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.linkedin.com/company/108364369/admin/dashboard/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61580237820864" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/open-course-events" className="text-gray-400 hover:text-white transition-colors">
                  Open Course Events
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-gray-400 hover:text-white transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/partner-hub" className="text-gray-400 hover:text-white transition-colors">
                  Partner Hub
                </Link>
              </li>
              <li>
                <Link to="/lms-demo" className="text-gray-400 hover:text-white transition-colors">
                  Book LMS Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Industries We Serve</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">Agriculture & Machinery</li>
              <li className="text-gray-400">Finance Services</li>
              <li className="text-gray-400">Manufacturing & Industry</li>
              <li className="text-gray-400">Real Estate & Services</li>
              <li className="text-gray-400">Import & Export</li>
              <li className="text-gray-400">AI & Technology</li>
              <li className="text-gray-400">Business & Marketing</li>
              <li className="text-gray-400">Insurance & Services</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a 
                    href="mailto:admin@kaizarildinternational.com" 
                    className="text-white hover:text-yellow-400 transition-colors"
                  >
                    admin@kaizarildinternational.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white">+254 713 955 653</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white">Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Kaizari LD International. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
