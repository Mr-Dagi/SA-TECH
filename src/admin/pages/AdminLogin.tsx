import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useData } from '../../shared/context/DataContext';
import { sanitizeInput, hasXssPattern } from '../../shared/utils/validation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Inline errors for email and password
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Touched states for blur handling
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useData();
  const navigate = useNavigate();

  // Rate limiting states
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  // Backoff countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  // Lockout countdown timer
  useEffect(() => {
    if (!isLocked || lockoutTimeLeft <= 0) return;
    const timer = window.setInterval(() => {
      setLockoutTimeLeft((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isLocked, lockoutTimeLeft]);

  // Input validation routines
  const checkEmail = (val: string) => {
    const trimmed = sanitizeInput(val);
    if (!trimmed) {
      setEmailError('Username or email is required');
      return false;
    }
    if (hasXssPattern(trimmed)) {
      setEmailError('Unsafe characters detected');
      return false;
    }

    const normalized = trimmed.toLowerCase().replace(/^@/, '');
    const isValidUsername = normalized.length >= 2 && /^[a-z0-9._-]+$/i.test(normalized);
    if (!isValidUsername) {
      setEmailError('Please enter a valid username or email');
      return false;
    }

    setEmailError('');
    return true;
  };

  const checkPassword = (val: string) => {
    const trimmed = val; // don't trim password as it might contain spaces, but check XSS
    if (!trimmed) {
      setPasswordError('Password is required');
      return false;
    }
    if (hasXssPattern(trimmed)) {
      setPasswordError('Unsafe characters detected');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    checkEmail(email);
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    checkPassword(password);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cooldown > 0 || isLocked) return;

    // Validate inputs
    const isEmailValid = checkEmail(email);
    const isPasswordValid = checkPassword(password);

    if (!isEmailValid || !isPasswordValid) {
      setError('Please fix the errors below.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const success = await login(sanitizeInput(email), password);
    setIsSubmitting(false);

    if (success) {
      setFailedAttempts(0);
      navigate('/admin');
    } else {
      const nextFailures = failedAttempts + 1;
      setFailedAttempts(nextFailures);

      if (nextFailures >= 5) {
        setIsLocked(true);
        setLockoutTimeLeft(600); // 10 minutes lockout
        setError('Too many failed attempts. Form locked for 10 minutes.');
      } else if (nextFailures === 3) {
        setCooldown(5); // 5s backoff
        setError('Too many attempts. Delayed for 5s.');
      } else if (nextFailures === 4) {
        setCooldown(15); // 15s backoff
        setError('Too many attempts. Delayed for 15s.');
      } else {
        setError('Invalid email or password');
      }
    }
  };

  const formatLockoutTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const isSubmitDisabled = isSubmitting || cooldown > 0 || isLocked;

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-6">
      <div className="w-full max-w-md bg-secondary p-8 rounded-3xl border border-color shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            SA teach startup<span className="text-accent-orange">.</span>
          </h1>
          <p className="text-secondary">Admin Dashboard Login</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center mb-6">
            {error}
          </div>
        )}

        {isLocked && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm text-center mb-6 font-semibold">
            Form locked. Try again in {formatLockoutTime(lockoutTimeLeft)}.
          </div>
        )}

        {cooldown > 0 && !isLocked && (
          <div className="bg-orange-500/10 border border-orange-500/50 text-accent-orange p-3 rounded-lg text-sm text-center mb-6 font-semibold">
            Too many attempts. Try again in {cooldown}s.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Username or Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tertiary"
                size={20}
              />
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailTouched) checkEmail(e.target.value);
                }}
                onBlur={handleEmailBlur}
                className={`w-full bg-primary border rounded-xl pl-12 pr-4 py-3 text-primary focus:outline-none transition-colors ${
                  emailTouched && emailError ? 'border-red-500 focus:border-red-500' : 'border-color focus:border-accent-blue'
                }`}
                disabled={isLocked}
                required
              />
            </div>
            {emailTouched && emailError && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tertiary"
                size={20}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordTouched) checkPassword(e.target.value);
                }}
                onBlur={handlePasswordBlur}
                className={`w-full bg-primary border rounded-xl pl-12 pr-4 py-3 text-primary focus:outline-none transition-colors ${
                  passwordTouched && passwordError ? 'border-red-500 focus:border-red-500' : 'border-color focus:border-accent-blue'
                }`}
                disabled={isLocked}
                required
              />
            </div>
            {passwordTouched && passwordError && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white px-8 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in...' : 'Login to Dashboard'} <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}