import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  toggleSidebar,
  toggleMobileSidebar,
  selectSidebarCollapsed,
} from '../../features/ui/uiSlice';
import { switchRoleDemo, selectIsAdmin, selectCurrentUser } from '../../features/auth/authSlice';
import { setSearchQuery, selectProjectsFilters } from '../../features/projects/projectSlice';
import { Sun, Moon, Menu, Search, LogOut, Bell, ShieldCheck, Eye, X } from 'lucide-react';
import { getInitials } from '../../utils/formatters';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAdmin = useAppSelector(selectIsAdmin);
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const { search } = useAppSelector(selectProjectsFilters);

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleMenuClick = () => {
    // Check if we are in mobile viewport (< 1024px)
    if (window.innerWidth < 1024) {
      dispatch(toggleMobileSidebar());
    } else {
      dispatch(toggleSidebar());
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-3 sm:px-6 bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs relative">
      {/* Left: Hamburger & Search */}
      <div className="flex items-center gap-2 sm:gap-3.5 flex-1 min-w-0">
        {/* Hamburger Toggle */}
        <button
          onClick={handleMenuClick}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center shrink-0"
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {/* Portal Mini Brand for Mobile */}
        <span className="font-bold text-sm text-slate-800 tracking-tight truncate sm:hidden">
          PMO PMIS
        </span>

        {/* Desktop & Tablet Search Bar */}
        <div className="hidden md:flex items-center relative w-full max-w-xs lg:max-w-sm">
          <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      {/* Mobile Search Popover when opened */}
      {mobileSearchOpen && (
        <div className="absolute inset-x-0 top-16 bg-white p-3 border-b border-slate-200 shadow-md md:hidden z-50 flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Search schemes, states, ministries..."
              value={search}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="p-2 text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Right: Role Switcher Demo, Theme Toggle, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Mobile Search Toggle Icon */}
        <button
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
          title="Search"
        >
          <Search size={18} />
        </button>

        {/* Quick Role Toggle (For Hackathon Judges Evaluation) */}
        <div
          className="flex items-center bg-slate-100 rounded-lg p-0.5 sm:p-1 border border-slate-200"
          title="Switch Active Evaluation Role"
        >
          <button
            onClick={() => dispatch(switchRoleDemo('ADMIN'))}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
              isAdmin
                ? 'bg-amber-100 text-amber-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck size={12} />
            <span className="hidden xs:inline sm:inline">ADMIN</span>
          </button>
          <button
            onClick={() => dispatch(switchRoleDemo('VIEWER'))}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
              !isAdmin
                ? 'bg-sky-100 text-sky-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye size={12} />
            <span className="hidden xs:inline sm:inline">VIEWER</span>
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 sm:p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
          title={isDark ? 'Light Theme' : 'Dark Theme'}
        >
          {isDark ? (
            <Sun size={17} className="text-amber-500" />
          ) : (
            <Moon size={17} className="text-blue-900" />
          )}
        </button>

        {/* Notifications (Hidden on 320px screen if tight, or compact) */}
        <button
          className="relative p-1.5 sm:p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer hidden xs:flex items-center justify-center"
          title="Project Alerts"
        >
          <Bell size={17} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white" />
        </button>

        {/* Official User Card */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 py-1 px-1.5 sm:px-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0"
            title={user?.name || 'Officer'}
          >
            {getInitials(user?.name || 'Officer')}
          </div>

          <div className="hidden sm:flex flex-col leading-tight max-w-[110px] truncate">
            <span className="text-xs font-semibold text-slate-900 truncate">
              {user?.name || 'Officer'}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span
                className={`text-[9px] font-bold px-1 py-0.2 rounded uppercase ${
                  isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {user?.role || 'VIEWER'}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer flex items-center"
            title="Terminate Session"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
