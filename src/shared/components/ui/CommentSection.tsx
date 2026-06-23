import React, { useState } from 'react';
import { Comment } from '../../types';
import { User, Clock, Reply, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTranslation } from 'react-i18next';
interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (comment: {
    author: string;
    email: string;
    content: string;
    parentId?: string;
  }) => void;
}
export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment
}) => {
  const { isAdmin } = useData();
  const { t } = useTranslation();
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !email || !content) return;
    onAddComment({
      author,
      email,
      content,
      parentId: replyTo || undefined
    });
    setAuthor('');
    setEmail('');
    setContent('');
    setReplyTo(null);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const CommentItem = ({
    comment,
    isReply = false



  }: {comment: Comment;isReply?: boolean;}) =>
  <div className={`flex gap-4 ${isReply ? 'ml-12 mt-4' : 'mt-8'}`}>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-orange/20 flex items-center justify-center flex-shrink-0">
        <User size={20} className="text-primary" />
      </div>
      <div className="flex-1 bg-secondary p-5 rounded-2xl border border-color">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h5 className="font-bold text-primary">{comment.author}</h5>
            <div className="flex items-center text-xs text-secondary gap-1 mt-1">
              <Clock size={12} />
              <span>{formatDate(comment.createdAt)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {!isReply &&
          <button
            onClick={() => setReplyTo(comment.id)}
            className="text-xs font-medium text-accent-blue hover:underline flex items-center gap-1">
            
                <Reply size={14} /> Reply
              </button>
          }
            {isAdmin &&
          <button className="text-xs font-medium text-accent-red hover:underline flex items-center gap-1">
                <Trash2 size={14} />
              </button>
          }
          </div>
        </div>
        <p className="text-secondary text-sm leading-relaxed mt-3">
          {comment.content}
        </p>
      </div>
    </div>;

  // Filter top-level comments (those without a parentId)
  // Note: In a real app, we'd structure this better, but for mock data we'll just render them flat or with basic nesting
  const topLevelComments = comments.filter((c) => !c.parentId);
  return (
    <div className="mt-16 pt-12 border-t border-color">
      <h3 className="text-2xl font-display font-bold mb-8">
        {t('commentsTitle')}{' '}
        <span className="text-secondary text-lg font-normal">
          {t('commentsCount', { count: comments.length })}
        </span>
      </h3>

      <div className="mb-12">
        {topLevelComments.length > 0 ?
        topLevelComments.map((comment) =>
        <div key={comment.id}>
              <CommentItem comment={comment} />
              {/* Render replies if any exist in the mock structure */}
              {comment.replies?.map((reply) =>
          <CommentItem key={reply.id} comment={reply} isReply />
          )}
            </div>
        ) :

        <p className="text-secondary italic">
            {t('noCommentsYet')}
          </p>
        }
      </div>

      <div className="bg-tertiary p-6 md:p-8 rounded-3xl">
        <h4 className="text-xl font-bold mb-6">
          {replyTo ? t('leaveAReply') : t('leaveAComment')}
        </h4>

        {replyTo &&
        <div className="mb-4 flex items-center justify-between bg-secondary p-3 rounded-lg border border-color">
            <span className="text-sm text-secondary">
              {t('replyingToComment')}
            </span>
            <button
            onClick={() => setReplyTo(null)}
            className="text-xs text-accent-red hover:underline">
            
              {t('cancelReply')}
            </button>
          </div>
        }

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                {t('nameLabel')}
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-secondary border border-color rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent-blue transition-colors"
                placeholder={t('nameLabel')} />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                {t('emailLabel')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary border border-color rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent-blue transition-colors"
                placeholder="john@example.com" />
              
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Comment
            </label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full bg-secondary border border-color rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent-blue transition-colors resize-none"
              placeholder="Your thoughts...">
            </textarea>
          </div>
          <button
            type="submit"
            className="bg-accent-blue hover:bg-accent-blue/90 text-white px-8 py-3 rounded-xl font-medium transition-colors">
            
            {t('postComment')}
          </button>
        </form>
      </div>
    </div>);

};