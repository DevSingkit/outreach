'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
  clinicName?: string;
  onSignOut?: () => void;
}

const IconPaw = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);

function IconLogOut({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg className="w-6 h-6 text-[var(--ink)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  );
}

function NavLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`
        relative flex items-center gap-3 px-4 py-3 rounded-[var(--radius-btn)] text-sm font-[family-name:var(--font-body)] font-medium
        transition-colors duration-150 select-none
        ${active
          ? 'text-[var(--p)] bg-[var(--p-tint)]'
          : 'text-[var(--ink)] hover:text-[var(--p)] hover:bg-[var(--p-tint)]/50'
        }
      `}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--p)] rounded-r-full" />
      )}
      <span className={`flex-shrink-0 ${active ? 'text-[var(--p)]' : 'text-[var(--ink-3)]'}`}>
        {item.icon}
      </span>
      {item.label}
    </Link>
  );
}

function SidebarLogo() {
  return (
    <div className="flex items-center gap-[10px] px-5 py-5 border-b border-[var(--p)]/8">
      <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, var(--p), var(--p-mid))' }}>
        <IconPaw size={20} />
      </div>
      <div className="flex flex-col leading-[1.1]">
        <span className="font-[family-name:var(--font-display)] text-[13px] font-bold text-[var(--p)] tracking-[-0.2px]">
          Northern Hills Vet
        </span>
        <span className="text-[10px] text-[var(--ink-3)] font-normal tracking-[0.3px]">
          Caloocan City, Metro Manila
        </span>
      </div>
    </div>
  );
}

export function Sidebar({ navItems, clinicName = 'NHVC', onSignOut }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const NavList = ({ onClickItem }: { onClickItem?: () => void }) => (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map(item => (
        <NavLink key={item.href} item={item} active={isActive(item.href)} onClick={onClickItem} />
      ))}
    </nav>
  );

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-[var(--surface)] rounded-[var(--radius-btn)] p-2 shadow-[var(--shadow-md)]"
        onClick={() => setMobileOpen(v => !v)}
        aria-label="Toggle menu"
      >
        <HamburgerIcon open={mobileOpen} />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-full w-[240px] bg-[var(--surface)] flex flex-col
        transition-transform duration-300 shadow-xl md:hidden
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarLogo />
        <div className="flex-1 overflow-y-auto py-4">
          <NavList onClickItem={() => setMobileOpen(false)} />
        </div>
      </aside>

      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-[240px] bg-[var(--surface)] border-r border-[var(--border-soft)] z-30">
        <SidebarLogo />
        <div className="flex-1 overflow-y-auto py-4">
          <NavList />
        </div>
        <div className="px-6 py-4 border-t border-[var(--border-soft)] flex flex-col gap-2">
          <button
            onClick={() => onSignOut?.()}
            className="flex items-center gap-2 text-sm text-[var(--ink-3)] hover:text-[var(--p)] transition-colors"
          >
            <IconLogOut size={18} />
            Sign Out
          </button>
          <p className="text-xs text-[var(--ink-3)] font-[family-name:var(--font-body)]">
            Outreach System v1.0
          </p>
        </div>
      </aside>
    </>
  );
}