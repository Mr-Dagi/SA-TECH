import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Tag } from 'lucide-react';
import { useData } from '../context/DataContext';
import { BlogCard } from '../components/ui/BlogCard';
import { useTranslation } from 'react-i18next';
export default function Blog() {
  const { t } = useTranslation();
  const { blogs } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  // Get visible blogs
  const visibleBlogs = blogs.filter((b) => b.visible);
  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    visibleBlogs.forEach((b) => b.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [visibleBlogs]);
  // Filter blogs
  const filteredBlogs = useMemo(() => {
    return visibleBlogs.filter((blog) => {
      const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag ? blog.tags.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [visibleBlogs, searchTerm, selectedTag]);
  return (
    <div className="pt-32 pb-20 min-h-screen">
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
            
            {t('myBlog')} <span className="text-accent-orange">{t('blog')}</span>
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
            
            {t('blogSubtitle')}
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {filteredBlogs.length > 0 ?
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredBlogs.map((post, index) =>
              <BlogCard key={post.id} post={post} index={index} />
              )}
              </div> :

            <div className="text-center py-20 bg-secondary rounded-3xl border border-color">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold mb-2">{t('noArticlesFound')}</h3>
                <p className="text-secondary">
                  {t('tryAdjustingFilters') || 'Try adjusting your search or tag filters.'}
                </p>
                <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag(null);
                }}
                className="mt-6 text-accent-orange font-medium hover:underline">
                
                  {t('clearAllFilters')}
                </button>
              </div>
            }
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Search */}
            <div className="bg-secondary p-6 rounded-3xl border border-color">
              <h3 className="text-xl font-bold mb-4">{t('search')}</h3>
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tertiary"
                  size={20} />
                
                <input
                  type="text"
                  placeholder={t('searchArticlesPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-primary border border-color rounded-xl pl-12 pr-4 py-3 text-primary focus:outline-none focus:border-accent-orange transition-colors" />
                
              </div>
            </div>

            {/* Tags */}
            <div className="bg-secondary p-6 rounded-3xl border border-color">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Tag size={20} className="text-accent-orange" /> {t('popularTags')}
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTag === null ? 'bg-accent-orange text-white' : 'bg-primary text-secondary hover:bg-tertiary'}`}>
                  {t('all')}
                </button>
                {allTags.map((tag) =>
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTag === tag ? 'bg-accent-orange text-white' : 'bg-primary text-secondary hover:bg-tertiary'}`}>
                  
                    {tag}
                  </button>
                )}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-accent-orange to-accent-red p-8 rounded-3xl text-white">
              <h3 className="text-2xl font-bold mb-2">{t('subscribe')}</h3>
              <p className="text-white/80 text-sm mb-6">
                {t('subscribeDesc')}
              </p>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder={t('yourEmailAddress')}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-colors" />
                
                <button className="w-full bg-white text-accent-orange font-bold py-3 rounded-xl hover:shadow-lg transition-all">
                  {t('subscribeNow')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>);

}