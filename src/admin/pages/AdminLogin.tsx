import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useData();
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials for demo purposes
    if (username === 'admin' && password === 'admin123') {
      login();
      navigate('/admin');
    } else {
      setError('Invalid username or password');
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
              Username
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tertiary"
                size={20} />

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-primary border border-color rounded-xl pl-12 pr-4 py-3 text-primary focus:outline-none focus:border-accent-blue transition-colors"
                placeholder="admin"
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
                placeholder="admin123"
                required />

            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white px-8 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-4">

            Login to Dashboard <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-tertiary">
          <p>Demo Credentials:</p>
          <p>
            Username: <strong>admin</strong> | Password:{' '}
            <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>);

}