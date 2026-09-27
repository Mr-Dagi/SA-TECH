import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Key, Shield, Mail, Lock, UserPlus, AlertTriangle } from 'lucide-react';
import { supabase, supabaseAdmin } from '../../shared/lib/supabaseClient';
import { DataState } from '../../shared/components/ui/DataState';
import type { User } from '@supabase/supabase-js';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPasswordId, setChangingPasswordId] = useState<string | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasAdminKey, setHasAdminKey] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
      if (fetchError) {
        setHasAdminKey(false);
        throw fetchError;
      }
      const adminUsers = (data.users || []).map((u: User) => ({
        id: u.id,
        email: u.email || '',
        role: (u.app_metadata as any)?.role || 'user',
        created_at: u.created_at || ''
      }));
      setUsers(adminUsers);
    } catch (err) {
      setHasAdminKey(false);
      setError('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: newEmail,
        password: newPassword,
        options: {
          data: { role: 'admin' }
        }
      });
      if (signUpError) throw signUpError;
      setNewEmail('');
      setNewPassword('');
      setShowAddForm(false);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (userId: string) => {
    if (!newPasswordValue) return;
    setIsSaving(true);
    setError(null);
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) throw new Error('User not found');
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserByEmail(
        user.email,
        { password: newPasswordValue }
      );
      if (updateError) throw updateError;
      setChangingPasswordId(null);
      setNewPasswordValue('');
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    setIsSaving(true);
    setError(null);
    try {
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (deleteError) throw deleteError;
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setIsSaving(false);
    }
  };

  const dataState = <DataState isLoading={isLoading} error={error} />;
  if (isLoading) return dataState;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">User Management</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-3 rounded-xl font-bold transition-colors"
        >
          <UserPlus size={20} /> {showAddForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {!hasAdminKey && (
        <div className="bg-orange-500/10 border border-orange-500/50 text-orange-500 p-4 rounded-xl text-sm mb-6 flex items-center gap-3">
          <AlertTriangle size={20} />
          <div>
            <p className="font-bold">Admin key not configured</p>
            <p>Add VITE_SUPABASE_SERVICE_ROLE_KEY to .env for full user management. Users can still be created.</p>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="bg-secondary p-6 rounded-2xl border border-color shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4">Add New User</h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="w-full bg-primary border border-color rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-primary border border-color rounded-lg px-4 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      <div className="bg-secondary rounded-2xl border border-color shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-color">
              <th className="text-left px-6 py-4 text-sm font-medium text-tertiary">Email</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-tertiary">Role</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-tertiary">Created</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-tertiary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-color/50 hover:bg-tertiary/20">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-tertiary" />
                    <span>{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                    user.role === 'admin'
                      ? 'bg-accent-blue/10 text-accent-blue'
                      : 'bg-tertiary text-secondary'
                  }`}>
                    <Shield size={12} />
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-secondary">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setChangingPasswordId(changingPasswordId === user.id ? null : user.id);
                        setError(null);
                      }}
                      className="p-2 rounded-lg text-accent-blue hover:bg-accent-blue/10 transition-colors"
                      title="Change Password"
                    >
                      <Key size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={isSaving}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {changingPasswordId === user.id && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="password"
                        value={newPasswordValue}
                        onChange={(e) => setNewPasswordValue(e.target.value)}
                        placeholder="New password"
                        className="flex-1 bg-primary border border-color rounded-lg px-4 py-2 text-sm"
                      />
                      <button
                        onClick={() => handleChangePassword(user.id)}
                        disabled={isSaving || !newPasswordValue}
                        className="bg-accent-blue hover:bg-accent-blue/90 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && !isLoading && (
          <div className="text-center py-12 text-secondary">No users found.</div>
        )}
      </div>
    </div>
  );
}
