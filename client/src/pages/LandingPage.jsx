import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { MODULE_LIST } from '../utils/constants';
import { CheckCircle2, Server, Database, Layers, ArrowRight, Shield, Code2 } from 'lucide-react';

export const LandingPage = () => {
  const { backendStatus } = useOutletContext() || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 p-8 border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>MERN Stack Architecture Initialized</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            FinTrack 360 Architecture Shell
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Personal finance management application structure for salaried professionals.
            Clean separation between frontend React/Vite client and Node/Express/MongoDB server.
          </p>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card hover title="Backend API" action={<Server className="w-5 h-5 text-emerald-400" />}>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Status:</span>
              <span className={`font-semibold ${backendStatus?.connected ? 'text-emerald-400' : 'text-amber-400'}`}>
                {backendStatus?.connected ? 'Online (v1.0.0)' : 'Connecting...'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Endpoint:</span>
              <span className="font-mono text-slate-300">/api/v1/health</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Environment:</span>
              <span className="text-slate-300 font-medium">Development</span>
            </div>
          </div>
        </Card>

        <Card hover title="Database Engine" action={<Database className="w-5 h-5 text-teal-400" />}>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">ORM / ODM:</span>
              <span className="text-slate-200 font-medium">Mongoose v8</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">User Scope:</span>
              <span className="text-slate-300 font-medium">userId Indexed</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Security:</span>
              <span className="text-emerald-400 font-medium">Hashes Auto-Sanitized</span>
            </div>
          </div>
        </Card>

        <Card hover title="Frontend Client" action={<Layers className="w-5 h-5 text-sky-400" />}>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Build Tool:</span>
              <span className="text-slate-200 font-medium">Vite + React 18</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Styling:</span>
              <span className="text-slate-200 font-medium">Tailwind CSS v3</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">State / Forms:</span>
              <span className="text-slate-200 font-medium">React Hook Form + Zod</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Module Roadmap Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">FinTrack 360 Core Modules</h2>
            <p className="text-xs text-slate-400">Architectural modules initialized for feature development</p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>9 Modules Configured</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MODULE_LIST.map((module) => (
            <Card key={module.id} hover className="border-slate-800/60">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-slate-200 text-sm">{module.name}</h3>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Ready</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">{module.description}</p>
              <div className="flex items-center text-[11px] text-slate-500 font-medium">
                <span>Pending Module Logic</span>
                <ArrowRight className="w-3 h-3 ml-1 text-slate-600" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
