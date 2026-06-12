import React from 'react';
import { motion } from 'framer-motion';
import { Download, Briefcase, GraduationCap } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SkillBar } from '../components/ui/SkillBar';
import { useTranslation } from 'react-i18next';
export default function About() {
  const { settings } = useData();
  const { t } = useTranslation();
  const frontendSkills = settings.skills.filter(
    (s) => s.category === 'Frontend'
  );
  const backendSkills = settings.skills.filter((s) => s.category === 'Backend');
  const designSkills = settings.skills.filter((s) => s.category === 'Design');
  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="text-5xl md:text-6xl font-display font-bold mb-6">
            
            {t('aboutHeader')} <span className="text-accent-orange">{t('aboutMeSuffix') || 'Me'}</span>
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.1
            }}
            className="text-lg text-secondary max-w-2xl mx-auto">
            
            {t('aboutIntro')}
          </motion.p>
        </div>

        {/* Bio Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{
              opacity: 0,
              x: -30
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            className="relative">
            
            <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-secondary shadow-2xl relative z-10">
              <img
                src={settings.profileImage}
                alt="Profile"
                className="w-full h-full object-cover" />
              
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full bg-accent-blue/20 rounded-[3rem] -z-10"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent-orange/20 rounded-full blur-2xl -z-10"></div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 30
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}>
            
            <h2 className="text-3xl font-display font-bold mb-6">
              {t('aboutDescription')}
            </h2>
            <div className="text-secondary space-y-4 mb-8 leading-relaxed">
              <p>{settings.aboutText}</p>
              <p>
                {t('aboutExperience') || 'For more than seven years, I have delivered web solutions for startups and established brands. I focus on clean structure, accessible interactions, and scalable code for products that feel refined and reliable.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-tertiary mb-1">{t('nameLabel')}</p>
                <p className="font-bold">
                  {settings.heroTitle.replace('Hy! I Am ', '')}
                </p>
              </div>
              <div>
                <p className="text-sm text-tertiary mb-1">{t('emailLabel')}</p>
                <p className="font-bold">{settings.email}</p>
              </div>
              <div>
                <p className="text-sm text-tertiary mb-1">{t('locationLabel')}</p>
                <p className="font-bold">{settings.location}</p>
              </div>
              <div>
                <p className="text-sm text-tertiary mb-1">{t('availabilityLabel')}</p>
                <p className="font-bold text-accent-green">
                  {t('availabilityText') || 'Freelance / Full-time'}
                </p>
              </div>
            </div>

            <a
              href={settings.cvUrl}
              className="inline-flex items-center bg-primary border-2 border-accent-orange text-accent-orange hover:bg-accent-orange hover:text-white px-8 py-3.5 rounded-full font-bold transition-all">
              
              <Download size={20} className="mr-2" /> Download CV
            </a>
          </motion.div>
        </div>

        {/* Skills Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">
            Professional <span className="text-accent-blue">Skills</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
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
              }}>
              
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  💻
                </span>{' '}
                Frontend
              </h3>
              <div className="bg-secondary p-6 rounded-3xl border border-color">
                {frontendSkills.map((skill, i) =>
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  colorClass="bg-blue-500"
                  delay={i * 0.1} />

                )}
              </div>
            </motion.div>

            <motion.div
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
                delay: 0.1
              }}>
              
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                  ⚙️
                </span>{' '}
                Backend
              </h3>
              <div className="bg-secondary p-6 rounded-3xl border border-color">
                {backendSkills.map((skill, i) =>
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  colorClass="bg-green-500"
                  delay={i * 0.1} />

                )}
              </div>
            </motion.div>

            <motion.div
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
                delay: 0.2
              }}>
              
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  🎨
                </span>{' '}
                Design
              </h3>
              <div className="bg-secondary p-6 rounded-3xl border border-color">
                {designSkills.map((skill, i) =>
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  colorClass="bg-orange-500"
                  delay={i * 0.1} />

                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Experience & Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
              <Briefcase className="text-accent-orange" /> Experience
            </h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-color before:to-transparent">
              {[
              {
                role: 'Senior UI/UX Designer',
                company: 'Google',
                period: '2021 - Present',
                desc: 'Leading design systems and user experience for core products.'
              },
              {
                role: 'Frontend Developer',
                company: 'Spotify',
                period: '2018 - 2021',
                desc: 'Developed responsive web applications using React and Redux.'
              },
              {
                role: 'Web Designer',
                company: 'Freelance',
                period: '2016 - 2018',
                desc: 'Created custom websites for various clients across different industries.'
              }].
              map((item, i) =>
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  x: -20
                }}
                whileInView={{
                  opacity: 1,
                  x: 0
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  delay: i * 0.1
                }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-primary bg-accent-orange text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Briefcase size={16} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-secondary p-6 rounded-2xl border border-color shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h4 className="font-bold text-lg">{item.role}</h4>
                      <span className="text-xs font-medium text-accent-orange bg-accent-orange/10 px-2 py-1 rounded-full">
                        {item.period}
                      </span>
                    </div>
                    <h5 className="text-sm font-medium text-tertiary mb-3">
                      {item.company}
                    </h5>
                    <p className="text-secondary text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
              <GraduationCap className="text-accent-blue" /> Education
            </h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-color before:to-transparent">
              {[
              {
                degree: 'Master in Computer Science',
                school: 'Stanford University',
                period: '2014 - 2016',
                desc: 'Specialized in Human-Computer Interaction and Artificial Intelligence.'
              },
              {
                degree: 'Bachelor in Graphic Design',
                school: 'Parsons School of Design',
                period: '2010 - 2014',
                desc: 'Graduated with honors. Focused on digital media and typography.'
              }].
              map((item, i) =>
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  x: 20
                }}
                whileInView={{
                  opacity: 1,
                  x: 0
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  delay: i * 0.1
                }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-primary bg-accent-blue text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <GraduationCap size={16} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-secondary p-6 rounded-2xl border border-color shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h4 className="font-bold text-lg">{item.degree}</h4>
                      <span className="text-xs font-medium text-accent-blue bg-accent-blue/10 px-2 py-1 rounded-full">
                        {item.period}
                      </span>
                    </div>
                    <h5 className="text-sm font-medium text-tertiary mb-3">
                      {item.school}
                    </h5>
                    <p className="text-secondary text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>);

}