import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Mail, DollarSign, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long').max(50, 'Name cannot exceed 50 characters'),
  currency: z.enum(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const SettingsPage = () => {
  const { user, updateProfile, updatePassword, logout } = useAuth();

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      currency: user?.currency || 'USD',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data) => {
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');
    try {
      await updateProfile(data);
      setProfileSuccess('Profile updated successfully.');
      setTimeout(() => setProfileSuccess(''), 5000);
    } catch (err) {
      setProfileError(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');
    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPasswordSuccess('Password updated successfully.');
      resetPasswordForm();
      setTimeout(() => setPasswordSuccess(''), 5000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || err.message || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings & Profile</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your account preferences and security.</p>
        </div>
        
        <Button onClick={logout} variant="outline" className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Details & Preferences */}
        <Card title="Profile Information">
          <div className="flex items-center space-x-4 mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40 text-indigo-400 text-2xl font-bold uppercase">
              {user?.name?.charAt(0) || '?'}
            </div>
            <div>
              <p className="text-lg font-bold text-white">{user?.name}</p>
              <div className="flex items-center text-sm text-slate-400 space-x-4">
                <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1" /> {user?.email}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown'}
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            {profileSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" /> {profileSuccess}
              </div>
            )}
            {profileError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" /> {profileError}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  {...registerProfile('name')}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 ${
                    profileErrors.name ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {profileErrors.name && <p className="text-xs text-rose-400">{profileErrors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-slate-500">Email cannot be changed.</p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Display Currency</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <DollarSign className="w-4 h-4" />
                </div>
                <select
                  {...registerProfile('currency')}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:border-indigo-500/60 focus:ring-indigo-500/20"
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="CAD">CAD ($) - Canadian Dollar</option>
                  <option value="AUD">AUD ($) - Australian Dollar</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" isLoading={profileLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Security / Password Change */}
        <Card title="Security">
          <p className="text-xs text-slate-400 mb-6">Update your password to keep your account secure.</p>
          
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            {passwordSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" /> {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" /> {passwordError}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Current Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  {...registerPassword('currentPassword')}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 ${
                    passwordErrors.currentPassword ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {passwordErrors.currentPassword && <p className="text-xs text-rose-400">{passwordErrors.currentPassword.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  {...registerPassword('newPassword')}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 ${
                    passwordErrors.newPassword ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {passwordErrors.newPassword && <p className="text-xs text-rose-400">{passwordErrors.newPassword.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  {...registerPassword('confirmPassword')}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-900 border rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 ${
                    passwordErrors.confirmPassword ? 'border-rose-500/80 focus:ring-rose-500/40' : 'border-slate-800 focus:border-indigo-500/60 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {passwordErrors.confirmPassword && <p className="text-xs text-rose-400">{passwordErrors.confirmPassword.message}</p>}
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" isLoading={passwordLoading}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
