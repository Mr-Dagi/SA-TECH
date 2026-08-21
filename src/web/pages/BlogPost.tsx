import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MessageSquare, Tag, Share2 } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { CommentSection } from '../../shared/components/ui/CommentSection';
import { DataState } from '../../shared/components/ui/DataState';
import { Comment } from '../../shared/types';
import { useTranslation } from 'react-i18next';
export default function BlogPost() {
  const { t } = useTranslation();
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const { blogs, addBlogComment, isLoading, error } = useData();
  const post = blogs.find((b) => b.id === id || b.slug === id);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  const dataState = <DataState isLoading={isLoading} error={error} />;
  if (isLoading || error) return dataState;
  if (!post || !post.published) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24">
        <h2 className="text-3xl font-bold mb-4">{t('articleNotFound')}</h2>
        <button
          onClick={() => navigate('/blog')}
          className="text-accent-orange hover:underline">
          
          {t('backToBlog')}
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
  const handleAddComment = (commentData: Omit<Comment, 'id' | 'createdAt' | 'replies'>) => {
    addBlogComment(post.id, commentData);
  };
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <Link
          to="/blog"
          className="inline-flex items-center text-secondary hover:text-primary mb-8 transition-colors group">
          
          <ArrowLeft
            size={20}
            className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          
          {t('backToBlog')}
        </Link>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {post.tags.map((tag) =>
            <span
              key={tag}
              className="text-xs font-bold bg-accent-orange/10 text-accent-orange px-3 py-1 rounded-full uppercase tracking-wider">
              
                {tag}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-6 text-secondary text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>{post.comments.length} {t('commentsLabel')}</span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage &&
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="rounded-[2rem] overflow-hidden mb-16 border border-color shadow-xl bg-primary aspect-[21/9]">
          
            <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-contain" />
          
          </motion.div>
        }

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-16 prose-headings:font-display prose-a:text-accent-orange hover:prose-a:text-accent-orange/80 prose-img:rounded-2xl">
          {/* In a real app, we'd use a markdown parser or dangerouslySetInnerHTML here */}
          <p className="lead text-xl text-secondary mb-8">{post.excerpt}</p>

          <div className="whitespace-pre-wrap">{post.content}</div>

          {/* Mock extra content for visual completeness */}
          <h2 className="text-3xl font-bold mt-12 mb-6">Why This Matters</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>

          <blockquote className="border-l-4 border-accent-orange pl-6 italic my-8 text-xl text-secondary">
            "The future of web development is not just about writing code, it's
            about creating experiences that matter."
          </blockquote>

          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
        </div>

        {/* Footer / Share */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-8 border-t border-b border-color mb-16">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <Tag size={20} className="text-tertiary" />
            <div className="flex gap-2">
              {post.tags.map((tag) =>
              <span
                key={tag}
                className="text-sm font-medium text-secondary hover:text-primary cursor-pointer">
                
                  #{tag}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-secondary">Share:</span>
            <button className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-secondary hover:bg-blue-500 hover:text-white transition-colors">
              <Share2 size={16} />
            </button>
            {/* Add more social icons as needed */}
          </div>
        </div>

        {/* Comments */}
        <CommentSection
          comments={post.comments}
          onAddComment={handleAddComment} />
        
      </div>
    </div>);

}
