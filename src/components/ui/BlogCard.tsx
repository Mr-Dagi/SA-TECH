import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types';
import { useTranslation } from 'react-i18next';
interface BlogCardProps {
  post: BlogPost;
  index?: number;
}
export const BlogCard: React.FC<BlogCardProps> = ({ post, index = 0 }) => {
  const { t } = useTranslation();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  return (
    <motion.article
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
      
      <Link
        to={`/blog/${post.id}`}
        className="block relative aspect-[16/10] overflow-hidden">
        
        <img
          src={post.coverImage || 'https://via.placeholder.com/800x500'}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          {post.tags.slice(0, 2).map((tag) =>
          <span
            key={tag}
            className="bg-primary/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            
              {tag}
            </span>
          )}
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-xs text-secondary mb-4">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare size={14} />
            <span>{post.comments.length} {t('commentsLabel')}</span>
          </div>
        </div>

        <Link to={`/blog/${post.id}`}>
          <h3 className="text-xl font-bold mb-3 text-primary group-hover:text-accent-orange transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-secondary text-sm mb-6 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>

        <Link
          to={`/blog/${post.id}`}
          className="mt-auto inline-flex items-center text-sm font-bold text-primary hover:text-accent-orange transition-colors group/link">
          
          {t('readArticle')}
          <ArrowRight
            size={16}
            className="ml-2 transform group-hover/link:translate-x-1 transition-transform" />
          
        </Link>
      </div>
    </motion.article>);

};