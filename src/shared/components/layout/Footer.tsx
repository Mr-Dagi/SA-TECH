import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Youtube, ArrowUp } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTranslation } from 'react-i18next';
export const Footer = () => {
  const { settings } = useData();
  const { t } = useTranslation();
  return (
    <footer className="bg-secondary border-t border-color pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-3 mb-4 inline-flex">
              <img src="/sa-1.png" alt="SA-Tech Startup logo" className="h-12 w-auto rounded-full shadow-lg" />
              <div>
                <span className="text-2xl font-display font-bold tracking-tight">
                  SA teach startup<span className="text-accent-orange">.</span>
                </span>
                <p className="text-tertiary text-sm mt-1 max-w-xs">
                  Crafting bold startup brands with polished interfaces and dependable web experiences.
                </p>
              </div>
            </Link>

            <div className="rounded-[2rem] border border-color bg-primary/10 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
              <p className="text-secondary leading-relaxed mb-5">
                We build elegant, user-first digital experiences that feel modern, fast, and memorable.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent-orange px-5 py-2 text-sm font-semibold text-white shadow-md shadow-accent-orange/30 transition-all hover:-translate-y-0.5 hover:bg-accent-red">
                Start a project
                <ArrowUp size={16} className="rotate-45" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-secondary hover:bg-accent-orange hover:text-white transition-colors shadow-sm"
                aria-label="GitHub">
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-secondary hover:bg-accent-blue hover:text-white transition-colors shadow-sm"
                aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-secondary hover:bg-accent-red hover:text-white transition-colors shadow-sm"
                aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-secondary hover:bg-accent-green hover:text-white transition-colors shadow-sm"
                aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">{t('quickLinks')}</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-secondary transition-colors hover:text-accent-orange hover:underline">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-secondary transition-colors hover:text-accent-orange hover:underline">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="text-secondary transition-colors hover:text-accent-orange hover:underline">
                  {t('projects')}
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-secondary transition-colors hover:text-accent-orange hover:underline">
                  {t('blog')}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-secondary transition-colors hover:text-accent-orange hover:underline">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">{t('contactInfo')}</h4>
            <div className="space-y-4 text-secondary">
              <div className="rounded-3xl border border-color bg-primary/10 p-4 transition-shadow hover:shadow-lg hover:shadow-accent-orange/10">
                <p className="text-sm text-tertiary">Location</p>
                <p className="font-semibold">{settings.location}</p>
              </div>
              <a
                href={`mailto:${settings.email}`}
                className="block rounded-3xl border border-color bg-primary/10 p-4 transition-shadow hover:shadow-lg hover:shadow-accent-blue/10 text-secondary">
                <p className="text-sm text-tertiary">Email</p>
                <p className="font-semibold">{settings.email}</p>
              </a>
              <a
                href={`tel:${settings.phone.replace(/[^+0-9]/g, '')}`}
                className="block rounded-3xl border border-color bg-primary/10 p-4 transition-shadow hover:shadow-lg hover:shadow-accent-red/10 text-secondary">
                <p className="text-sm text-tertiary">Phone</p>
                <p className="font-semibold">{settings.phone}</p>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-color pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-tertiary text-sm">
            &copy; {new Date().getFullYear()} SA teach startup. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );

};