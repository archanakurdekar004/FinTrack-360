import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Tags,
  PieChart,
  TrendingUp,
  Repeat,
  Target,
  Settings,
} from 'lucide-react';
import { NAV_LINKS } from '../../utils/constants';

const iconMap = {
  LayoutDashboard,
  Receipt,
  Tags,
  PieChart,
  TrendingUp,
  Repeat,
  Target,
  Settings,
};

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-950/90 border-r border-slate-800/80 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        <div className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Core Modules
        </div>

        <nav className="space-y-1">
          {NAV_LINKS.map((link) => {
            const IconComponent = iconMap[link.icon] || LayoutDashboard;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Architecture badge footer */}
      <div className="p-4 m-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
        <div className="font-semibold text-slate-300 mb-1">MERN Architecture</div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Modular REST APIs, Mongoose schemas & Zod validators initialized.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
