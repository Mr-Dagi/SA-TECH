import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { DataState } from '../../shared/components/ui/DataState';
export default function AdminSettings() {
  const { settings, updateSettings, isLoading, error } = useData();
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    setFormData(settings);
  }, [settings]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings(formData);
    setIsSaving(false);
    alert('Settings saved successfully!');
  };
  const dataState = <DataState isLoading={isLoading} error={error} />;
  if (isLoading || error) return dataState;
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-display font-bold mb-8">Site Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Info */}
        <div className="bg-secondary p-6 rounded-2xl border border-color shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-color pb-4">
            General Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={formData.heroTitle}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  heroTitle: e.target.value
                })
                }
                className="w-full bg-primary border border-color rounded-lg px-4 py-2" />
              
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Summary
              </label>
              <textarea
                rows={2}
                value={formData.heroSubtitle}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  heroSubtitle: e.target.value
                })
                }
                className="w-full bg-primary border border-color rounded-lg px-4 py-2" />
              
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                About the Company
              </label>
              <textarea
                rows={4}
                value={formData.aboutText}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  aboutText: e.target.value
                })
                }
                className="w-full bg-primary border border-color rounded-lg px-4 py-2" />
              
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-secondary p-6 rounded-2xl border border-color shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-color pb-4">
            Media Links
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Logo
              </label>
              <div className="flex gap-4">
                <input
                  type="url"
                  value={formData.profileImage}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    profileImage: e.target.value
                  })
                  }
                  placeholder="Company logo is managed by the site"
                  disabled
                  className="flex-1 bg-primary border border-color rounded-lg px-4 py-2" />
                
                <img
                  src={formData.profileImage}
                  alt="Preview"
                  className="w-10 h-10 rounded-lg object-contain bg-primary border border-color" />
                
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Public Document URL
              </label>
              <input
                type="url"
                value={formData.cvUrl}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  cvUrl: e.target.value
                })
                }
                placeholder="Optional - leave empty for no download link"
                className="w-full bg-primary border border-color rounded-lg px-4 py-2" />
              
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-accent-blue hover:bg-accent-blue/90 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-70">
            
            <Save size={20} />
            {isSaving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>);

}
