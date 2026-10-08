import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, Activity, LogOut } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

export const Navbar = ({ backendStatus }) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/50">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-tight">{APP_NAME}</h1>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
            Auth Module Active
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Backend Connectivity Status Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <Activity
            className={`w-3.5 h-3.5 ${
              backendStatus?.connected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'
            }`}
          />
          <span className="text-slate-300 font-medium">
            API: {backendStatus?.connected ? 'Connected (v1.0.0)' : 'Checking...'}
          </span>
        </div>

        {/* Authenticated User Account info & Logout */}
        {user ? (
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-semibold text-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-semibold text-slate-200">{user.name || 'User'}</div>
              <div className="text-slate-500">{user.email}</div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
