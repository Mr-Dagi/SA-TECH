import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { ProjectCard } from '../../shared/components/ui/ProjectCard';
import { DataState } from '../../shared/components/ui/DataState';
import { useTranslation } from 'react-i18next';
export default function Projects() {
  const { t } = useTranslation();
  const { projects, isLoading, error } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  // Get visible projects
  const visibleProjects = projects.filter((p) => p.visible);
  // Extract all unique technologies for the filter
  const allTechs = useMemo(() => {
    const techs = new Set<string>();
    visibleProjects.forEach((p) => p.techStack.forEach((t) => techs.add(t)));
    return Array.from(techs).sort();
  }, [visibleProjects]);
  // Filter projects based on search and selected tech
  const filteredProjects = useMemo(() => {
    return visibleProjects.filter((project) => {
      const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTech = selectedTech ?
      project.techStack.includes(selectedTech) :
      true;
      return matchesSearch && matchesTech;
    });
  }, [visibleProjects, searchTerm, selectedTech]);
  const dataState = <DataState isLoading={isLoading} error={error} />;
  if (isLoading || error) return dataState;
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-12">
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
            
            {t('projects')} <span className="text-accent-blue">{t('projects')}</span>
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
            
            {t('projectsSubtitle') || 'Selected digital products, platforms, and technology solutions.'}
          </motion.p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 justify-between items-center bg-secondary p-4 rounded-2xl border border-color shadow-sm">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tertiary"
              size={20} />
            
            <input
              type="text"
              placeholder={t('searchProjectsPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-primary border border-color rounded-xl pl-12 pr-4 py-3 text-primary focus:outline-none focus:border-accent-blue transition-colors" />
            
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter className="text-tertiary flex-shrink-0" size={20} />
            <button
              onClick={() => setSelectedTech(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedTech === null ? 'bg-accent-blue text-white' : 'bg-primary text-secondary hover:bg-tertiary'}`}>
              
              All
            </button>
            {allTechs.map((tech) =>
            <button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedTech === tech ? 'bg-accent-blue text-white' : 'bg-primary text-secondary hover:bg-tertiary'}`}>
              
                {tech}
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) =>
          <ProjectCard key={project.id} project={project} index={index} />
          )}
          </div> :

        <div className="text-center py-20 bg-secondary rounded-3xl border border-color">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">{t('noProjectsFound')}</h3>
            <p className="text-secondary">
              {t('tryAdjustingFilters') || 'Try adjusting your search or filters.'}
            </p>
            <button
            onClick={() => {
              setSearchTerm('');
              setSelectedTech(null);
            }}
            className="mt-6 text-accent-blue font-medium hover:underline">
            
              {t('clearAllFilters')}
            </button>
          </div>
        }
      </div>
    </div>);

}
