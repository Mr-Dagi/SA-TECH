import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { login, logout, AuthError, MissingIdentityError } from '@netlify/identity';
import { useData } from '../../shared/context/DataContext';
export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAdmin, authReady } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (authReady && isAdmin) {
      navigate('/tlku');
    }
  }, [authReady, isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (!user.roles?.includes('admin')) {
        await logout().catch(() => {});
        setError('This account does not have admin access.');
        return;
      }
      navigate('/tlku');
    } catch (err) {
      if (err instanceof MissingIdentityError) {
        setError('Identity is not enabled for this site yet.');
      } else if (err instanceof AuthError) {
        setError(err.status === 401 ? 'Invalid email or password.' : err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-6">
      <div className="w-full max-w-md bg-secondary p-8 rounded-3xl border border-color shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            SA teach startup<span className="text-accent-orange">.</span>
          </h1>
          <p className="text-secondary">Admin Dashboard Login</p>
        </div>

        {error &&
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center mb-6">
            {error}
          </div>
        }

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tertiary"
                size={20} />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-primary border border-color rounded-xl pl-12 pr-4 py-3 text-primary focus:outline-none focus:border-accent-blue transition-colors"
                placeholder="you@example.com"
                autoComplete="email"
                required />

            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tertiary"
                size={20} />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-primary border border-color rounded-xl pl-12 pr-4 py-3 text-primary focus:outline-none focus:border-accent-blue transition-colors"
                placeholder="••••••••"
                autoComplete="current-password"
                required />

            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-blue hover:bg-accent-blue/90 disabled:opacity-60 text-white px-8 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-4">

            {loading ? 'Signing in…' : 'Login to Dashboard'} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>);

}
