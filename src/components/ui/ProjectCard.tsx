import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Project } from '../../types';
import { useTranslation } from 'react-i18next';
interface ProjectCardProps {
  project: Project;
  index?: number;
}
export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index = 0
}) => {
  const { t } = useTranslation();
  return (
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
        delay: index * 0.1
      }}
      className="group bg-secondary rounded-3xl overflow-hidden border border-color shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.images[0] || 'https://via.placeholder.com/800x600'}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        
        <div className="absolute top-4 right-4 bg-secondary/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold">
            {project.averageRating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 text-primary group-hover:text-accent-blue transition-colors">
          {project.title}
        </h3>
        <p className="text-secondary text-sm mb-4 line-clamp-2 flex-grow">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.slice(0, 3).map((tech) =>
          <span
            key={tech}
            className="text-xs font-medium bg-tertiary px-2.5 py-1 rounded-md text-secondary">
            
              {tech}
            </span>
          )}
          {project.techStack.length > 3 &&
          <span className="text-xs font-medium bg-tertiary px-2.5 py-1 rounded-md text-secondary">
              +{project.techStack.length - 3}
            </span>
          }
        </div>

        <Link
          to={`/projects/${project.id}`}
          className="mt-auto inline-flex items-center text-sm font-bold text-primary hover:text-accent-blue transition-colors group/link">
          
          {t('viewProject')}
          <ArrowRight
            size={16}
            className="ml-2 transform group-hover/link:translate-x-1 transition-transform" />
          
        </Link>
      </div>
    </motion.div>);

};