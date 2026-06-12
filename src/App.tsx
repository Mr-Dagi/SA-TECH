import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate } from
'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';
// Layouts
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AdminLayout } from './components/layout/AdminLayout';
// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBlog from './pages/admin/AdminBlog';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';
const ProtectedRoute = ({ children }: {children: React.ReactNode;}) => {
  const { isAdmin } = useData();
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
};
const PublicLayout = ({ children }: {children: React.ReactNode;}) =>
<div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>;

const AppContent = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
          <PublicLayout>
              <Home />
            </PublicLayout>
          } />
        
        <Route
          path="/about"
          element={
          <PublicLayout>
              <About />
            </PublicLayout>
          } />
        
        <Route
          path="/projects"
          element={
          <PublicLayout>
              <Projects />
            </PublicLayout>
          } />
        
        <Route
          path="/projects/:id"
          element={
          <PublicLayout>
              <ProjectDetail />
            </PublicLayout>
          } />
        
        <Route
          path="/blog"
          element={
          <PublicLayout>
              <Blog />
            </PublicLayout>
          } />
        
        <Route
          path="/blog/:id"
          element={
          <PublicLayout>
              <BlogPost />
            </PublicLayout>
          } />
        
        <Route
          path="/contact"
          element={
          <PublicLayout>
              <Contact />
            </PublicLayout>
          } />
        

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
          <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        
        <Route
          path="/admin/projects"
          element={
          <ProtectedRoute>
              <AdminProjects />
            </ProtectedRoute>
          } />
        
        <Route
          path="/admin/blog"
          element={
          <ProtectedRoute>
              <AdminBlog />
            </ProtectedRoute>
          } />
        
        <Route
          path="/admin/messages"
          element={
          <ProtectedRoute>
              <AdminMessages />
            </ProtectedRoute>
          } />
        
        <Route
          path="/admin/settings"
          element={
          <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          } />
        
      </Routes>
    </Router>);

};
export function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ThemeProvider>);

}