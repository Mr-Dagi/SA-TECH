import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider } from './shared/context/DataContext';
import { ThemeProvider } from './shared/context/ThemeContext';
import { ToastProvider } from './shared/components/ui/Toast';
import { ScrollManager } from './shared/components/ui/ScrollManager';
import { BackToTopButton } from './shared/components/ui/BackToTopButton';
import { ErrorBoundary } from './shared/components/ui/ErrorBoundary';
import './shared/index.css';
import './shared/i18n';
import { Navbar } from './shared/components/layout/Navbar';
import { Footer } from './shared/components/layout/Footer';
import Home from './web/pages/Home';
import About from './web/pages/About';
import Projects from './web/pages/Projects';
import ProjectDetail from './web/pages/ProjectDetail';
import Blog from './web/pages/Blog';
import BlogPost from './web/pages/BlogPost';
import Contact from './web/pages/Contact';
import NotFound from './web/pages/NotFound';
import { AdminLayout } from './admin/components/layout/AdminLayout';
import { ProtectedRoute } from './admin/components/ProtectedRoute';

const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const AdminProjects = lazy(() => import('./admin/pages/AdminProjects'));
const AdminBlog = lazy(() => import('./admin/pages/AdminBlog'));
const AdminMessages = lazy(() => import('./admin/pages/AdminMessages'));
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings'));
const ChatAssistant = lazy(() => import('./shared/components/ui/ChatAssistant'));

const adminFallback = (
  <div className="min-h-screen flex items-center justify-center bg-primary text-primary">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-accent-blue border-t-transparent" />
      <p className="mt-3 text-sm text-secondary">Loading admin dashboard...</p>
    </div>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/tlku');

  return (
    <>
      {!isAdminPath && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/tlku/login" element={<Suspense fallback={adminFallback}><AdminLogin /></Suspense>} />
        <Route path="/tlku" element={<ProtectedRoute><Suspense fallback={adminFallback}><AdminLayout><Dashboard /></AdminLayout></Suspense></ProtectedRoute>} />
        <Route path="/tlku/projects" element={<ProtectedRoute><Suspense fallback={adminFallback}><AdminLayout><AdminProjects /></AdminLayout></Suspense></ProtectedRoute>} />
        <Route path="/tlku/blog" element={<ProtectedRoute><Suspense fallback={adminFallback}><AdminLayout><AdminBlog /></AdminLayout></Suspense></ProtectedRoute>} />
        <Route path="/tlku/messages" element={<ProtectedRoute><Suspense fallback={adminFallback}><AdminLayout><AdminMessages /></AdminLayout></Suspense></ProtectedRoute>} />
        <Route path="/tlku/settings" element={<ProtectedRoute><Suspense fallback={adminFallback}><AdminLayout><AdminSettings /></AdminLayout></Suspense></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdminPath && <Footer />}
      {!isAdminPath && (
        <Suspense fallback={null}>
          <ChatAssistant />
          <BackToTopButton />
        </Suspense>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <DataProvider>
            <ErrorBoundary>
              <ScrollManager />
              <AppContent />
            </ErrorBoundary>
          </DataProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
