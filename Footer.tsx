
import { Link } from "react-router-dom";
import { Volume2, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">PDF to Audio</span>
            </div>
            <p className="text-gray-400">
              Making documents accessible through high-quality text-to-speech conversion.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Features
            </h3>
            <ul className="space-y-2">
              <li><Link to="/upload" className="text-gray-400 hover:text-white transition-colors">PDF Conversion</Link></li>
              <li><Link to="/accessibility" className="text-gray-400 hover:text-white transition-colors">Accessibility Tools</Link></li>
              <li><span className="text-gray-400">Audio Controls</span></li>
              <li><span className="text-gray-400">Multi-language Support</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><span className="text-gray-400">Privacy Policy</span></li>
              <li><span className="text-gray-400">Terms of Service</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Accessibility
            </h3>
            <ul className="space-y-2">
              <li><span className="text-gray-400">WCAG 2.1 AA Compliant</span></li>
              <li><span className="text-gray-400">Screen Reader Support</span></li>
              <li><span className="text-gray-400">Keyboard Navigation</span></li>
              <li><span className="text-gray-400">Voice Controls</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400">
            © 2024 PDF to Audio System. Made with <Heart className="inline h-4 w-4 text-red-500" /> for accessibility.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="text-gray-400 text-sm">GDPR Compliant</span>
            <span className="text-gray-400 text-sm">Files Auto-Deleted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
