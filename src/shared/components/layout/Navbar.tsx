import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useTranslation } from 'react-i18next';
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAdmin, settings } = useData();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navLinks = [
  {
    name: t('home'),
    path: '/'
  },
  {
    name: t('about'),
    path: '/about'
  },
  {
    name: t('projects'),
    path: '/projects'
  },
  {
    name: t('blog'),
    path: '/blog'
  }];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };
  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-secondary/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
              <img src={settings.profileImage} alt={settings.name} className="h-12 w-auto rounded-full shadow-md" />
          <span className="text-2xl font-display font-bold tracking-tight">
            {settings.name}<span className="text-accent-orange">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6">
            {navLinks.map((link) =>
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-accent-orange ${isActive(link.path) ? 'text-accent-orange' : 'text-secondary'}`}>
              
                {link.name}
              </Link>
            )}
            {isAdmin &&
            <Link
              to="/tlku"
              className="text-sm font-medium text-accent-blue hover:text-accent-blue/80 transition-colors">
              
                {t('adminDashboard')}
              </Link>
            }
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-tertiary transition-colors text-secondary flex items-center gap-1"
                onClick={() => setLangOpen(!langOpen)}
              >
                <Globe size={20} />
                <span className="text-sm">{i18n.language.toUpperCase()}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-secondary border border-color rounded-lg shadow-lg py-1 z-50">
                  {[
                    { code: 'en', name: 'English' },
                    { code: 'am', name: 'አማርኛ' },
                    { code: 'fr', name: 'Français' },
                    { code: 'it', name: 'Italiano' },
                    { code: 'om', name: 'Oromoo' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-tertiary transition-colors"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-tertiary transition-colors text-secondary">
              
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link
              to="/contact"
              className="bg-accent-orange hover:bg-accent-orange/90 text-white px-6 py-2.5 rounded-full font-medium transition-all transform hover:scale-105">
              
              {t('contactUs')}
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <button onClick={toggleTheme} className="p-2 text-secondary">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-primary">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen &&
      <div className="md:hidden absolute top-full left-0 w-full bg-secondary border-b border-color shadow-lg py-4 px-6 flex flex-col space-y-4">
          {navLinks.map((link) =>
        <Link
          key={link.name}
          to={link.path}
          onClick={() => setIsOpen(false)}
          className={`text-lg font-medium ${isActive(link.path) ? 'text-accent-orange' : 'text-secondary'}`}>
          
              {link.name}
            </Link>
        )}
          {isAdmin &&
        <Link
          to="/tlku"
          onClick={() => setIsOpen(false)}
          className="text-lg font-medium text-accent-blue">
          
              {t('adminDashboard')}
            </Link>
        }
          <Link
          to="/contact"
          onClick={() => setIsOpen(false)}
          className="bg-accent-orange text-white text-center py-3 rounded-lg font-medium mt-4">
          
            {t('contactUs')}
          </Link>
        </div>
      }
    </nav>);

};