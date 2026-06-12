import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Calendar, Code2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Rating } from '../components/ui/Rating';
import { CommentSection } from '../components/ui/CommentSection';
import { useTranslation } from 'react-i18next';
export default function ProjectDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const { projects, addProjectComment } = useData();
  const project = projects.find((p) => p.id === id);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  if (!project || !project.visible) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24">
        <h2 className="text-3xl font-bold mb-4">{t('projectNotFound')}</h2>
        <button
          onClick={() => navigate('/projects')}
          className="text-accent-blue hover:underline">
          
          {t('backToProjects')}
        </button>
      </div>);

  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const handleAddComment = (commentData: any) => {
    addProjectComment(project.id, commentData);
  };
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <Link
          to="/projects"
          className="inline-flex items-center text-secondary hover:text-primary mb-8 transition-colors group">
          
          <ArrowLeft
            size={20}
            className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          
          {t('backToProjects')}
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {project.techStack.map((tech) =>
            <span
              key={tech}
              className="text-sm font-medium bg-accent-blue/10 text-accent-blue px-3 py-1 rounded-full">
              
                {tech}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-secondary">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{formatDate(project.createdAt)}</span>
            </div>
            <Rating
              projectId={project.id}
              initialRating={project.averageRating}
              totalVotes={project.ratings.length} />
            
          </div>
        </div>

        {/* Main Image */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="rounded-3xl overflow-hidden mb-12 border border-color shadow-xl">
          
          <img
            src={project.images[0] || 'https://via.placeholder.com/1200x600'}
            alt={project.title}
            className="w-full h-auto object-cover aspect-video" />
          
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Content */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">{t('aboutTheProject')}</h3>
              <div className="prose prose-invert max-w-none text-secondary leading-relaxed">
                <p>{project.description}</p>
                {/* In a real app, this might be rich text HTML */}
                <p className="mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>

            {project.images.length > 1 &&
            <div>
                <h3 className="text-2xl font-bold mb-4">{t('gallery')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {project.images.slice(1).map((img, i) =>
                <img
                  key={i}
                  src={img}
                  alt={`${project.title} gallery ${i}`}
                  className="rounded-xl border border-color w-full h-48 object-cover" />

                )}
                </div>
              </div>
            }
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-secondary p-6 rounded-2xl border border-color">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Code2 size={20} className="text-accent-orange" /> {t('technologiesUsed')}
              </h4>
              <ul className="space-y-2">
                {project.techStack.map((tech) =>
                <li
                  key={tech}
                  className="flex items-center gap-2 text-secondary">
                  
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-orange"></div>
                    {tech}
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-secondary p-6 rounded-2xl border border-color flex flex-col gap-4">
              {project.liveUrl &&
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white py-3 rounded-xl font-medium transition-colors">
                
                  <ExternalLink size={18} /> {t('liveDemo')}
                </a>
              }
              {project.githubUrl &&
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-primary border border-color hover:border-primary text-primary py-3 rounded-xl font-medium transition-colors">
                
                  <Github size={18} /> {t('sourceCode')}
                </a>
              }
            </div>
          </div>
        </div>

        {/* Comments */}
        <CommentSection
          comments={project.comments}
          onAddComment={handleAddComment} />
        
      </div>
    </div>);

}