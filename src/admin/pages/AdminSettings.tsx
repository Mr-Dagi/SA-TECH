import React, { useEffect, useState, useCallback } from 'react';
import { Save, Undo2, Redo2, RotateCw, X, Globe } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { DataState } from '../../shared/components/ui/DataState';
import type { SiteSettings } from '../../shared/types';

const defaultSocialLinks = [
  { platform: 'GitHub', url: 'https://github.com', icon: 'github' },
  { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
  { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
  { platform: 'YouTube', url: 'https://youtube.com', icon: 'youtube' }
];

export default function AdminSettings() {
  const { settings, updateSettings, isLoading, error } = useData();
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [initialData, setInitialData] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<SiteSettings[]>([settings]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    setFormData(settings);
    setInitialData(settings);
    setHistory([settings]);
    setHistoryIndex(0);
  }, [settings]);

  const pushHistory = useCallback((data: SiteSettings) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      const updated = [...newHistory, data];
      return updated.slice(-50);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const updateField = (field: keyof SiteSettings, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    pushHistory(updated);
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const updated = {
      ...formData,
      socialLinks: formData.socialLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    };
    setFormData(updated);
    pushHistory(updated);
  };

  const addSocialLink = () => {
    const updated = {
      ...formData,
      socialLinks: [...formData.socialLinks, { platform: 'New', url: '', icon: 'globe' }]
    };
    setFormData(updated);
    pushHistory(updated);
  };

  const removeSocialLink = (index: number) => {
    if (formData.socialLinks.length <= 1) return;
    const updated = {
      ...formData,
      socialLinks: formData.socialLinks.filter((_, i) => i !== index)
    };
    setFormData(updated);
    pushHistory(updated);
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setFormData(history[newIndex]);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setFormData(history[newIndex]);
  };

  const handleCancel = () => {
    setFormData(initialData);
    setHistory([initialData]);
    setHistoryIndex(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings(formData);
    setIsSaving(false);
    setInitialData(formData);
    setHistory([formData]);
    setHistoryIndex(0);
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);
  const dataState = <DataState isLoading={isLoading} error={error} />;
  if (isLoading || error) return dataState;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Site Settings</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={!canUndo || isSaving}
            className="p-2 rounded-lg bg-tertiary text-secondary hover:bg-tertiary/80 disabled:opacity-30 transition-colors"
            title="Undo"
          >
            <Undo2 size={18} />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo || isSaving}
            className="p-2 rounded-lg bg-tertiary text-secondary hover:bg-tertiary/80 disabled:opacity-30 transition-colors"
            title="Redo"
          >
            <Redo2 size={18} />
          </button>
          <button
            onClick={() => { setFormData(initialData); setHistory([initialData]); setHistoryIndex(0); }}
            disabled={!hasChanges || isSaving}
            className="p-2 rounded-lg bg-tertiary text-secondary hover:bg-tertiary/80 disabled:opacity-30 transition-colors"
            title="Reset"
          >
            <RotateCw size={18} />
          </button>
          <button
            onClick={handleCancel}
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-color text-secondary hover:bg-tertiary transition-colors disabled:opacity-30"
          >
            <X size={18} /> Cancel
          </button>
          <button
            type="submit"
            form="settings-form"
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
          >
            <Save size={18} /> {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <form id="settings-form" onSubmit={handleSubmit} className="space-y-8">
        {/* Header Settings */}
        <div className="bg-secondary p-6 rounded-2xl border border-color shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-color pb-4">Header & Logo</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full bg-primary border border-color rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Site Title</label>
              <input
                type="text"
                value={formData.siteTitle || ''}
                onChange={(e) => updateField('siteTitle', e.target.value)}
                className="w-full bg-primary border border-color rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => updateField('tagline', e.target.value)}
                className="w-full bg-primary border border-color rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Logo URL</label>
              <div className="flex gap-4">
                <input
                  type="url"
                  value={formData.profileImage}
                  onChange={(e) => updateField('profileImage', e.target.value)}
                  className="flex-1 bg-primary border border-color rounded-lg px-4 py-2"
                />
                <img src={formData.profileImage} alt="Preview" className="w-12 h-12 rounded-lg object-contain bg-primary border border-color" />
              </div>
            </div>
          </div>
        </div>

        {/* General Info */}
        <div className="bg-secondary p-6 rounded-2xl border border-color shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-color pb-4">Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Summary</label>
              <textarea
                rows={2}
                value={formData.heroSubtitle}
                onChange={(e) => updateField('heroSubtitle', e.target.value)}
                className="w-full bg-primary border border-color rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">About the Company</label>
              <textarea
                rows={4}
                value={formData.aboutText}
                onChange={(e) => updateField('aboutText', e.target.value)}
                className="w-full bg-primary border border-color rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">About Short Description</label>
              <textarea
                rows={2}
                value={formData.aboutText}
                onChange={(e) => updateField('aboutText', e.target.value)}
                className="w-full bg-primary border border-color rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-secondary p-6 rounded-2xl border border-color shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-color pb-4">
            <h2 className="text-xl font-bold">Social Media Links</h2>
            <button
              type="button"
              onClick={addSocialLink}
              className="flex items-center gap-1 text-accent-blue hover:text-accent-blue/80 text-sm font-medium transition-colors"
            >
              <Globe size={16} /> Add Link
            </button>
          </div>
          <div className="space-y-3">
            {formData.socialLinks.map((link, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={link.platform}
                  onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                  className="w-32 bg-primary border border-color rounded-lg px-4 py-2 text-sm"
                  placeholder="Platform"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  className="flex-1 bg-primary border border-color rounded-lg px-4 py-2 text-sm"
                  placeholder="https://..."
                />
                <select
                  value={link.icon}
                  onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                  className="bg-primary border border-color rounded-lg px-4 py-2 text-sm text-secondary"
                >
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="youtube">YouTube</option>
                  <option value="globe">Globe</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  disabled={formData.socialLinks.length <= 1}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 disabled:opacity-30 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-secondary p-6 rounded-2xl border border-color shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b border-color pb-4">Contact Info</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full bg-primary border border-color rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full bg-primary border border-color rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full bg-primary border border-color rounded-lg px-4 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CV/Document URL</label>
              <input
                type="url"
                value={formData.cvUrl}
                onChange={(e) => updateField('cvUrl', e.target.value)}
                placeholder="Optional"
                className="w-full bg-primary border border-color rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-color text-secondary hover:bg-tertiary transition-colors disabled:opacity-50"
          >
            <X size={18} /> Cancel
          </button>
          <button
            type="submit"
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
          >
            <Save size={20} /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
