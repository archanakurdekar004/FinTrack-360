import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { ShieldCheck, User, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { APP_NAME } from '../utils/constants';

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters long')
      .max(50, 'Full name cannot exceed 50 characters'),
    email: z
      .string()
      .trim()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const RegisterPage = () => {
  const { register: registerUser, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Redirect authenticated user away from register page
  if (isAuthenticated && !authLoading) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      {/* Container */}
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-xl shadow-emerald-950/50 mb-2">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{APP_NAME}</h1>
          <p className="text-xs text-slate-400">
            Create your account to start tracking your finances
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-2xl p-8 shadow-2xl border border-slate-800/80">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">Create Account</h2>

            {/* Server Error Alert */}
            {serverError && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start space-x-2 animate-shake"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Full Name Field */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-xs font-medium text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Alex Smith"
                  {...register('name')}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-900/80 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                    errors.name
                      ? 'border-rose-500/80 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-emerald-500/60 focus:ring-emerald-500/20'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-400 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-medium text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="alex.smith@company.com"
                  {...register('email')}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-900/80 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                    errors.email
                      ? 'border-rose-500/80 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-emerald-500/60 focus:ring-emerald-500/20'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  {...register('password')}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-900/80 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                    errors.password
                      ? 'border-rose-500/80 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-emerald-500/60 focus:ring-emerald-500/20'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-slate-300">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  {...register('confirmPassword')}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-900/80 border rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                    errors.confirmPassword
                      ? 'border-rose-500/80 focus:ring-rose-500/40'
                      : 'border-slate-800 focus:border-emerald-500/60 focus:ring-emerald-500/20'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-400 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-3"
              isLoading={isSubmitting}
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors underline-offset-4 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
