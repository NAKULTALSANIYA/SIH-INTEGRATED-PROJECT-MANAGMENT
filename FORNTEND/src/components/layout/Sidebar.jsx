import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectSidebarCollapsed } from '../../features/ui/uiSlice';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Cpu,
  Layers,
  ChevronRight,
} from 'lucide-react';

const Sidebar = () => {
  const collapsed = useAppSelector(selectSidebarCollapsed);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Task Board', path: '/tasks', icon: CheckSquare },
  ];

  return (
    <aside
      className="glass-panel"
      style={{
        width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        minHeight: '100vh',
        height: '100%',
        borderRadius: 0,
        borderLeft: 'none',
        borderTop: 'none',
        borderBottom: 'none',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--transition-normal)',
        position: 'sticky',
        top: 0,
        zIndex: 110,
        overflow: 'hidden',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: collapsed ? '0 18px' : '0 22px',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary-500), var(--accent-violet))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
          }}
        >
          <Cpu size={20} />
        </div>

        {!collapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span
              style={{
                fontWeight: 700,
                fontSize: '1rem',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              SIH ProjectHub
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                color: 'var(--primary-400)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Enterprise Edition
            </span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {!collapsed && (
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              padding: '0 12px 6px',
              letterSpacing: '0.08em',
            }}
          >
            Navigation
          </span>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link-item ${isActive ? 'nav-link-active' : ''}`
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '0.875rem',
                transition: 'all var(--transition-fast)',
                textDecoration: 'none',
              }}
              title={collapsed ? item.name : undefined}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{item.name}</span>
              )}
              {!collapsed && (
                <ChevronRight size={14} className="nav-arrow" style={{ opacity: 0 }} />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Architecture Badge */}
      {!collapsed && (
        <div style={{ padding: '16px', margin: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-hover)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Layers size={16} color="var(--primary-500)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Redux Toolkit Active
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
            Axios client + RTK slices synced for projects, tasks & UI state.
          </p>
        </div>
      )}

      <style>{`
        .nav-link-item:hover {
          background-color: var(--bg-hover);
          color: var(--text-primary);
        }
        .nav-link-item:hover .nav-arrow {
          opacity: 0.7;
        }
        .nav-link-active {
          background-color: var(--primary-600) !important;
          color: #ffffff !important;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        .nav-link-active .nav-arrow {
          opacity: 1 !important;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
