import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { DataState } from '../../shared/components/ui/DataState';
import { Project } from '../../shared/types';
export default function AdminProjects() {
  const { projects, addProject, updateProject, deleteProject, isLoading, error } = useData();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    images: '',
    githubUrl: '',
    liveUrl: '',
    featured: false,
    visible: true
  });
  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingId(project.id);
      setFormData({
        title: project.title,
        description: project.description,
        techStack: project.techStack.join(', '),
        images: project.images.join('\n'),
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        featured: project.featured,
        visible: project.visible
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        techStack: '',
        images: '',
        githubUrl: '',
        liveUrl: '',
        featured: false,
        visible: true
      });
    }
    setIsModalOpen(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      title: formData.title,
      description: formData.description,
      techStack: formData.techStack.
      split(',').
      map((t) => t.trim()).
      filter(Boolean),
      images: formData.images.
      split('\n').
      map((i) => i.trim()).
      filter(Boolean),
      githubUrl: formData.githubUrl,
      liveUrl: formData.liveUrl,
      featured: formData.featured,
      visible: formData.visible
    };
    if (editingId) {
      await updateProject(editingId, projectData);
    } else {
      await addProject(projectData);
    }
    setIsModalOpen(false);
  };
  const toggleVisibility = async (id: string, currentVisible: boolean) => {
    await updateProject(id, {
      visible: !currentVisible
    });
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    setPendingDeleteId(null);
  };
  const dataState = <DataState isLoading={isLoading} error={error} />;
  if (isLoading || error) return dataState;
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold">Manage Projects</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-accent-blue hover:bg-accent-blue/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          
          <Plus size={18} /> Add Project
        </button>
      </div>

      <div className="bg-secondary rounded-2xl border border-color shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-tertiary border-b border-color text-secondary text-sm">
                <th className="p-4 font-medium">Project</th>
                <th className="p-4 font-medium">Tech Stack</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-color">
              {projects.map((project) =>
              <tr
                key={project.id}
                className="hover:bg-primary/50 transition-colors">
                
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                      src={project.images[0] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"%3E%3Crect width="120" height="120" rx="24" fill="%23f3f4f6"/%3E%3Cpath d="M34 86l20-22 14 16 18-22 10 12v10H34z" fill="%2394a3b8"/%3E%3Ccircle cx="46" cy="46" r="10" fill="%2394a3b8"/%3E%3C/svg%3E'}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover" />
                    
                      <div>
                        <p className="font-bold text-primary">
                          {project.title}
                        </p>
                        <p className="text-xs text-secondary">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.slice(0, 2).map((tech) =>
                    <span
                      key={tech}
                      className="text-[10px] bg-primary border border-color px-2 py-0.5 rounded text-secondary">
                      
                          {tech}
                        </span>
                    )}
                      {project.techStack.length > 2 &&
                    <span className="text-[10px] text-tertiary">
                          +{project.techStack.length - 2}
                        </span>
                    }
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <span
                      className={`text-xs px-2 py-1 rounded-full ${project.visible ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      
                        {project.visible ? 'Visible' : 'Hidden'}
                      </span>
                      {project.featured &&
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600">
                          Featured
                        </span>
                    }
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                      onClick={() =>
                      toggleVisibility(project.id, project.visible)
                      }
                      className="p-2 text-secondary hover:text-primary bg-primary rounded-lg border border-color">
                      
                        {project.visible ?
                      <Eye size={16} /> :

                      <EyeOff size={16} />
                      }
                      </button>
                      <button
                      onClick={() => handleOpenModal(project)}
                      className="p-2 text-accent-blue hover:bg-accent-blue/10 bg-primary rounded-lg border border-color">
                      
                        <Edit2 size={16} />
                      </button>
                      <button
                      onClick={() => setPendingDeleteId(project.id)}
                      className="p-2 text-accent-red hover:bg-accent-red/10 bg-primary rounded-lg border border-color">
                      
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pendingDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-color bg-secondary p-6 shadow-2xl">
            <h3 className="text-xl font-bold">Delete project?</h3>
            <p className="mt-3 text-sm text-secondary">Are you sure you want to delete this project? This cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setPendingDeleteId(null)} className="rounded-lg border border-color px-4 py-2 text-sm">Cancel</button>
              <button onClick={() => handleDelete(pendingDeleteId)} className="rounded-lg bg-accent-red px-4 py-2 text-sm font-medium text-white">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen &&
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-secondary rounded-2xl border border-color shadow-2xl w-full max-w-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-color">
              <h2 className="text-xl font-bold">
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
              onClick={() => setIsModalOpen(false)}
              className="text-secondary hover:text-primary">
              
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                required
                type="text"
                value={formData.title}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value
                })
                }
                className="w-full bg-primary border border-color rounded-lg px-4 py-2" />
              
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value
                })
                }
                className="w-full bg-primary border border-color rounded-lg px-4 py-2">
              </textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tech Stack (comma separated)
                </label>
                <input
                required
                type="text"
                value={formData.techStack}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  techStack: e.target.value
                })
                }
                className="w-full bg-primary border border-color rounded-lg px-4 py-2"
                placeholder="React, Node.js, Tailwind" />
              
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image URLs (one per line)
                </label>
                <textarea
                required
                rows={3}
                value={formData.images}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  images: e.target.value
                })
                }
                className="w-full bg-primary border border-color rounded-lg px-4 py-2"
                placeholder="https://...">
              </textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    GitHub URL
                  </label>
                  <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    githubUrl: e.target.value
                  })
                  }
                  className="w-full bg-primary border border-color rounded-lg px-4 py-2" />
                
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Live URL
                  </label>
                  <input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    liveUrl: e.target.value
                  })
                  }
                  className="w-full bg-primary border border-color rounded-lg px-4 py-2" />
                
                </div>
              </div>
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={formData.visible}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    visible: e.target.checked
                  })
                  }
                  className="w-4 h-4" />
                
                  <span className="text-sm font-medium">Visible to public</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured: e.target.checked
                  })
                  }
                  className="w-4 h-4" />
                
                  <span className="text-sm font-medium">
                    Featured on Home page
                  </span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-color mt-6">
                <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-color hover:bg-tertiary">
                
                  Cancel
                </button>
                <button
                type="submit"
                className="bg-accent-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-accent-blue/90">
                
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>);

}
