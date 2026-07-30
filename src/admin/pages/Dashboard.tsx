import { Link } from 'react-router-dom';
import {
  FolderKanban,
  FileText,
  MessageSquare,
  Star,
  ArrowRight } from
'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { DataState } from '../../shared/components/ui/DataState';
export default function Dashboard() {
  const { projects, blogs, messages, isLoading, error } = useData();
  const dataState = <DataState isLoading={isLoading} error={error} />;
  if (isLoading || error) return dataState;
  const unreadMessages = messages.filter((m) => !m.read);
  // Calculate total comments across all projects and blogs
  const totalComments =
  projects.reduce((acc, p) => acc + p.comments.length, 0) +
  blogs.reduce((acc, b) => acc + b.comments.length, 0);
  const stats = [
  {
    title: 'Total Projects',
    value: projects.length,
    icon: <FolderKanban size={24} />,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    link: '/admin/projects'
  },
  {
    title: 'Blog Posts',
    value: blogs.length,
    icon: <FileText size={24} />,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    link: '/admin/blog'
  },
  {
    title: 'Unread Messages',
    value: unreadMessages.length,
    icon: <MessageSquare size={24} />,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    link: '/admin/messages'
  },
  {
    title: 'Total Comments',
    value: totalComments,
    icon: <Star size={24} />,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    link: '#'
  }];

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">
        Dashboard Overview
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) =>
        <div
          key={i}
          className="bg-secondary p-6 rounded-2xl border border-color shadow-sm flex items-center justify-between">
          
            <div>
              <p className="text-secondary text-sm font-medium mb-1">
                {stat.title}
              </p>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
            </div>
            <div
            className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
            
              {stat.icon}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Messages */}
        <div className="bg-secondary rounded-2xl border border-color shadow-sm overflow-hidden">
          <div className="p-6 border-b border-color flex justify-between items-center">
            <h3 className="font-bold text-lg">Recent Messages</h3>
            <Link
              to="/admin/messages"
              className="text-sm text-accent-blue hover:underline flex items-center gap-1">
              
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-color">
            {messages.slice(0, 5).map((msg) =>
            <div
              key={msg.id}
              className={`p-4 flex flex-col gap-2 ${!msg.read ? 'bg-primary/50' : ''}`}>
              
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    {msg.name}
                    {!msg.read &&
                  <span className="w-2 h-2 rounded-full bg-accent-orange"></span>
                  }
                  </h4>
                  <span className="text-xs text-tertiary">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-secondary line-clamp-1">
                  {msg.message}
                </p>
              </div>
            )}
            {messages.length === 0 &&
            <div className="p-8 text-center text-secondary">
                No messages yet.
              </div>
            }
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-secondary rounded-2xl border border-color shadow-sm p-6">
          <h3 className="font-bold text-lg mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/projects"
              className="bg-primary border border-color p-4 rounded-xl hover:border-accent-blue hover:text-accent-blue transition-colors flex flex-col items-center justify-center gap-3 text-center">
              
              <FolderKanban size={24} />
              <span className="font-medium text-sm">Manage Projects</span>
            </Link>
            <Link
              to="/admin/blog"
              className="bg-primary border border-color p-4 rounded-xl hover:border-accent-green hover:text-accent-green transition-colors flex flex-col items-center justify-center gap-3 text-center">
              
              <FileText size={24} />
              <span className="font-medium text-sm">Manage Blog</span>
            </Link>
            <Link
              to="/admin/settings"
              className="bg-primary border border-color p-4 rounded-xl hover:border-accent-orange hover:text-accent-orange transition-colors flex flex-col items-center justify-center gap-3 text-center col-span-2">
              
              <Star size={24} />
              <span className="font-medium text-sm">
                Edit Profile & Settings
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>);

}
