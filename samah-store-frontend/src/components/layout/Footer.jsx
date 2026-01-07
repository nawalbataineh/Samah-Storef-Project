/**
 * SAMAH STORE - Footer Component
 * Feminine fashion footer with warm charcoal background
 */

import { Link } from 'react-router-dom';
import { Instagram, Facebook, Send } from 'lucide-react';
import Logo from '../Logo';
import { useState } from 'react';

// Footer navigation
const FOOTER_LINKS = {
  shop: {
    title: 'تسوّقي',
    links: [
      { name: 'جديد', href: '/products?sort=createdAt,desc' },
      { name: 'جميع المنتجات', href: '/products' },
    ],
  },
  help: {
    title: 'خدمة العملاء',
    links: [
      { name: 'الشحن والتوصيل', href: '/faq' },
      { name: 'الإرجاع والاستبدال', href: '/faq' },
      { name: 'الأسئلة الشائعة', href: '/faq' },
      { name: 'اتصلي بنا', href: '/contact' },
    ],
  },
  company: {
    title: 'الشركة',
    links: [
      { name: 'عن سماح', href: '/about' },
      { name: 'سياسة الخصوصية', href: '/privacy' },
      { name: 'الشروط والأحكام', href: '/terms' },
    ],
  },
};

const SOCIAL_LINKS = [
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/samahstore' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/samahstore' },
];

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="bg-charcoal-800 text-white">
      {/* Main Footer */}
      <div className="container-main py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <Logo variant="footer" className="text-white" />
            </div>
            <p className="text-ivory-400 text-sm leading-relaxed mb-6 max-w-xs">
              وجهتك المفضلة للأزياء العصرية. نختار لك أجمل القطع بعناية.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-charcoal-700 hover:bg-rose-300 flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4 text-ivory-300" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div className="lg:col-span-2">
            <h4 className="font-serif text-base font-medium mb-5 text-white">
              {FOOTER_LINKS.shop.title}
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-ivory-400 hover:text-rose-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div className="lg:col-span-2">
            <h4 className="font-serif text-base font-medium mb-5 text-white">
              {FOOTER_LINKS.help.title}
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.help.links.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-ivory-400 hover:text-rose-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h4 className="font-serif text-base font-medium mb-5 text-white">
              {FOOTER_LINKS.company.title}
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-ivory-400 hover:text-rose-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="font-serif text-base font-medium mb-5 text-white">
              النشرة البريدية
            </h4>
            <p className="text-sm text-ivory-400 mb-4">
              اشتركي للعروض الحصرية
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                className="w-full px-4 py-3 bg-charcoal-700 border border-charcoal-600 rounded-lg text-white text-sm placeholder:text-charcoal-400 focus:outline-none focus:border-rose-300 transition-colors"
                required
              />
              <button
                type="submit"
                className="w-full py-3 bg-rose-300 text-charcoal-800 text-sm font-medium rounded-lg hover:bg-rose-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>اشتراك</span>
                <Send className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-charcoal-700">
        <div className="container-main py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-charcoal-400">
              © {new Date().getFullYear()} Samah Store. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/terms" className="text-xs text-charcoal-400 hover:text-rose-300 transition-colors">
                الشروط والأحكام
              </Link>
              <Link to="/privacy" className="text-xs text-charcoal-400 hover:text-rose-300 transition-colors">
                سياسة الخصوصية
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
