import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../shared/context/DataContext';
import { useTranslation } from 'react-i18next';
export default function Home() {
  const { settings, projects } = useData();
  const { t } = useTranslation();
  const featuredProjects = projects.
  filter((p) => p.featured && p.visible).
  slice(0, 3);
  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5
            }}
            className="flex-1 max-w-2xl">
            
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              {t('heroTitleStart')}
              <span className="text-accent-blue">{t('heroName')}</span>
            </h1>
            <p className="text-lg text-secondary mb-8 leading-relaxed max-w-lg">
              {t('heroSubtitle')}
            </p>
            <div className="mb-8">
              <p className="text-sm text-secondary mb-4 font-medium">{t('technologies')}</p>
              <div className="flex flex-wrap gap-3">
                {['HTML', 'CSS', 'JavaScript', 'PHP', 'C++', 'Java', 'MySQL', 'AI', 'DevOps', 'Cloud'].map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="bg-tertiary text-primary px-4 py-2 rounded-full text-sm font-medium border border-color hover:border-accent-blue transition-colors"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="bg-accent-orange hover:bg-accent-orange/90 text-white px-8 py-3.5 rounded-full font-medium transition-transform hover:scale-105 shadow-lg shadow-accent-orange/20">
                
                {t('hireMe')}
              </Link>
              <a
                href={settings.cvUrl}
                className="bg-secondary border border-color hover:border-accent-blue text-primary px-8 py-3.5 rounded-full font-medium transition-all hover:text-accent-blue">
                
                {t('downloadCV')}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              duration: 0.5,
              delay: 0.2
            }}
            className="flex-1 relative">
            
            <div className="relative w-full max-w-md mx-auto aspect-square rounded-full bg-gradient-to-tr from-accent-orange/20 to-accent-blue/20 flex items-center justify-center p-8">
              <img
                src={settings.profileImage}
                alt="Profile"
                className="w-full h-full object-cover rounded-full shadow-2xl" />
              

              {/* Floating Badges */}
              <motion.div
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'easeInOut'
                }}
                className="absolute top-10 right-0 bg-secondary p-4 rounded-2xl shadow-xl border border-color flex items-center gap-3">
                
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl">
                  🏆
                </div>
                <div>
                  <p className="text-xs text-secondary font-medium">
                    Best Design
                  </p>
                  <p className="text-sm font-bold text-primary">Awards</p>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 10, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: 'easeInOut',
                  delay: 1
                }}
                className="absolute bottom-10 left-0 bg-secondary p-4 rounded-2xl shadow-xl border border-color flex items-center gap-3">
                
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">
                  🎨
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">UI/UX</p>
                  <p className="text-xs text-secondary">Specialist</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-tertiary py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              {t('services')}
            </h2>
            <p className="text-secondary max-w-2xl mx-auto">
              {t('servicesDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
            {
              title: 'Web Development',
              icon: '💻',
              description: 'HTML, CSS, JavaScript, PHP, C++, Java, MySQL',
              color: 'from-blue-500/20 to-purple-500/20',
              border: 'border-blue-500/30'
            },
            {
              title: 'App Development',
              icon: '📱',
              description: 'Mobile & desktop app development',
              color: 'from-cyan-500/20 to-blue-500/20',
              border: 'border-cyan-500/30'
            },
            {
              title: 'DevOps & Cloud',
              icon: '☁️',
              description: 'Cloud infrastructure, CI/CD, deployment',
              color: 'from-sky-500/20 to-indigo-500/20',
              border: 'border-sky-500/30'
            },
            {
              title: 'AI & Automation',
              icon: '🤖',
              description: 'AI systems, automation and smart tools',
              color: 'from-violet-500/20 to-fuchsia-500/20',
              border: 'border-violet-500/30'
            },
            {
              title: 'Branding & Marketing',
              icon: '🎨',
              description: 'Rebranding, digital marketing and strategy',
              color: 'from-orange-500/20 to-red-500/20',
              border: 'border-orange-500/30'
            },
            {
              title: 'Consulting',
              icon: '🧠',
              description: 'Technical consultancy and project planning',
              color: 'from-emerald-500/20 to-lime-500/20',
              border: 'border-emerald-500/30'
            }].
            map((service, i) =>
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: i * 0.1
              }}
              className={`bg-secondary p-8 rounded-3xl border ${service.border} shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}>
              
                <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl mb-6`}>
                
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-secondary leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Me */}
      <section className="py-20 container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
              {t('whyChoose')}
            </h2>
            <p className="text-secondary mb-8 leading-relaxed">
              {t('whyChooseDesc')}
            </p>
            <ul className="space-y-4 mb-8">
              {[
                t('quality'),
                t('commitment'),
                t('active')
              ].map(
                (item, i) =>
                <li
                  key={i}
                  className="flex items-center gap-3 text-lg font-medium">
                  
                    <CheckCircle className="text-accent-green" size={24} />
                    {item}
                  </li>

              )}
            </ul>
          </div>
          <div className="flex-1 relative">
            <div className="bg-gradient-to-br from-accent-orange/20 to-accent-red/20 rounded-[3rem] p-8 aspect-square flex items-end justify-center relative overflow-hidden">
              <img
                src={settings.profileImage}
                alt="Profile"
                className="w-3/4 h-auto object-cover rounded-t-[2rem] z-10" />
              

              <div className="absolute bottom-10 left-0 bg-secondary p-5 rounded-2xl shadow-xl border border-color z-20 flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-orange/10 rounded-full flex items-center justify-center text-accent-orange">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="font-bold text-lg">{t('active')}</p>
                  <p className="text-sm text-secondary">chat your problem</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="bg-tertiary py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              {t('recentProjects')} <span className="text-accent-blue">Project</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project, i) =>
            <motion.div
              key={project.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: i * 0.1
              }}
              className="group relative rounded-3xl overflow-hidden bg-secondary border border-color shadow-md">
              
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map((tech) =>
                  <span
                    key={tech}
                    className="text-xs font-medium bg-tertiary px-2 py-1 rounded-md text-secondary">
                    
                        {tech}
                      </span>
                  )}
                  </div>
                  <Link
                  to={`/projects/${project.id}`}
                  className="inline-flex items-center text-accent-blue font-medium hover:gap-2 transition-all">
                  
                    View Details <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="inline-flex items-center justify-center px-8 py-3 bg-secondary border border-color hover:border-accent-blue rounded-full font-medium transition-colors">
              
              {t('viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 container mx-auto px-6 md:px-12">
        <div className="bg-gradient-to-r from-accent-orange to-accent-red rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              {t('ctaTitle')}
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
              {t('ctaDesc')}
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-accent-orange px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all">
              
              {t('shootMessage')}
            </Link>
          </div>
        </div>
      </section>
    </div>);

}