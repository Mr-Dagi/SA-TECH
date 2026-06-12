import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { BlogPost } from '../../types';
export default function AdminBlog() {
  const { blogs, addBlog, updateBlog, deleteBlog } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    coverImage: '',
    visible: true
  });
  const handleOpenModal = (blog?: BlogPost) => {
    if (blog) {
      setEditingId(blog.id);
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        tags: blog.tags.join(', '),
        coverImage: blog.coverImage || '',
        visible: blog.visible
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        tags: '',
        coverImage: '',
        visible: true
      });
    }
    setIsModalOpen(true);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const blogData = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      tags: formData.tags.
      split(',').
      map((t) => t.trim()).
      filter(Boolean),
      coverImage: formData.coverImage,
      visible: formData.visible
    };
    if (editingId) {
      updateBlog(editingId, blogData);
    } else {
      addBlog(blogData);
    }
    setIsModalOpen(false);
  };
  const toggleVisibility = (id: string, currentVisible: boolean) => {
    updateBlog(id, {
      visible: !currentVisible
    });
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold">Manage Blog Posts</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-accent-green hover:bg-accent-green/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          
          <Plus size={18} /> Add Post
        </button>
      </div>

      <div className="bg-secondary rounded-2xl border border-color shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-tertiary border-b border-color text-secondary text-sm">
                <th className="p-4 font-medium">Post</th>
                <th className="p-4 font-medium">Tags</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-color">
              {blogs.map((blog) =>
              <tr
                key={blog.id}
                className="hover:bg-primary/50 transition-colors">
                
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                      src={
                      blog.coverImage || 'https://via.placeholder.com/100'
                      }
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover" />
                    
                      <div>
                        <p className="font-bold text-primary line-clamp-1">
                          {blog.title}
                        </p>
                        <p className="text-xs text-secondary">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 2).map((tag) =>
                    <span
                      key={tag}
                      className="text-[10px] bg-primary border border-color px-2 py-0.5 rounded text-secondary">
                      
                          {tag}
                        </span>
                    )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                    className={`text-xs px-2 py-1 rounded-full ${blog.visible ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    
                      {blog.visible ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                      onClick={() => toggleVisibility(blog.id, blog.visible)}
                      className="p-2 text-secondary hover:text-primary bg-primary rounded-lg border border-color">
                      
                        {blog.visible ?
                      <Eye size={16} /> :

                      <EyeOff size={16} />
                      }
                      </button>
                      <button
                      onClick={() => handleOpenModal(blog)}
                      className="p-2 text-accent-blue hover:bg-accent-blue/10 bg-primary rounded-lg border border-color">
                      
                        <Edit2 size={16} />
                      </button>
                      <button
                      onClick={() => deleteBlog(blog.id)}
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

      {/* Modal */}
      {isModalOpen &&
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-secondary rounded-2xl border border-color shadow-2xl w-full max-w-4xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-color">
              <h2 className="text-xl font-bold">
                {editingId ? 'Edit Post' : 'Add New Post'}
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
                  Excerpt
                </label>
                <textarea
                required
                rows={2}
                value={formData.excerpt}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  excerpt: e.target.value
                })
                }
                className="w-full bg-primary border border-color rounded-lg px-4 py-2">
              </textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Content (Markdown/Text)
                </label>
                <textarea
                required
                rows={10}
                value={formData.content}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  content: e.target.value
                })
                }
                className="w-full bg-primary border border-color rounded-lg px-4 py-2 font-mono text-sm">
              </textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                  required
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value
                  })
                  }
                  className="w-full bg-primary border border-color rounded-lg px-4 py-2"
                  placeholder="React, Tutorial" />
                
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cover Image URL
                  </label>
                  <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    coverImage: e.target.value
                  })
                  }
                  className="w-full bg-primary border border-color rounded-lg px-4 py-2" />
                
                </div>
              </div>
              <div className="pt-2">
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
                
                  <span className="text-sm font-medium">
                    Publish immediately
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
                className="bg-accent-green text-white px-6 py-2 rounded-lg font-medium hover:bg-accent-green/90">
                
                  Save Post
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>);

}