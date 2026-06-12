import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Home } from
'lucide-react';
import { useData } from '../../context/DataContext';
export const AdminLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, messages } = useData();
  const unreadCount = messages.filter((m) => !m.read).length;
  const navItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: <LayoutDashboard size={20} />
  },
  {
    name: 'Projects',
    path: '/admin/projects',
    icon: <FolderKanban size={20} />
  },
  {
    name: 'Blog Posts',
    path: '/admin/blog',
    icon: <FileText size={20} />
  },
  {
    name: 'Messages',
    path: '/admin/messages',
    icon: <MessageSquare size={20} />,
    badge: unreadCount
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: <Settings size={20} />
  }];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  return (
    <div className="min-h-screen bg-primary flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-secondary border-r border-color flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-color">
          <Link
            to="/"
            className="text-2xl font-display font-bold tracking-tight flex items-center text-primary">
            
            SA teach startup<span className="text-accent-orange">.</span>
            <span className="ml-2 text-xs bg-accent-blue/10 text-accent-blue px-2 py-1 rounded-full uppercase tracking-wider">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-accent-blue/10 text-accent-blue font-medium' : 'text-secondary hover:bg-tertiary hover:text-primary'}`}>
                
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 &&
                <span className="bg-accent-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                }
              </Link>);

          })}
        </nav>

        <div className="p-4 border-t border-color space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-secondary hover:bg-tertiary hover:text-primary transition-colors">
            
            <Home size={20} />
            <span>View Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-accent-red hover:bg-accent-red/10 transition-colors">
            
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-primary">
        <div className="p-6 md:p-10">{children}</div>
      </main>
    </div>);

};