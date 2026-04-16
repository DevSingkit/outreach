'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconLogOut({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg className="w-6 h-6 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  );
}

// ─── Nav Link ─────────────────────────────────────────────────────────────────

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`
        relative flex items-center gap-3 px-4 py-3 rounded-btn text-sm font-dm font-medium
        transition-colors duration-150 select-none
        ${
          active
            ? 'text-primary bg-primary/8'
            : 'text-text hover:text-primary hover:bg-primary/5'
        }
      `}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
      )}

      <span className={`flex-shrink-0 ${active ? 'text-primary' : 'text-muted'}`}>
        {item.icon}
      </span>

      {item.label}
    </Link>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export function Sidebar({
  navItems,
  clinicName = 'NHVC',
  onSignOut,
}: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  const NavList = ({ onClickItem }: { onClickItem?: () => void }) => (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map(item => (
        <NavLink
          key={item.href}
          item={item}
          active={isActive(item.href)}
          onClick={onClickItem}
        />
      ))}
    </nav>
  );

  return (
    <>
      {/* ── Mobile toggle ───────────────────────── */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-surface rounded-btn p-2 shadow-md"
        onClick={() => setMobileOpen(v => !v)}
        aria-label="Toggle menu"
      >
        <HamburgerIcon open={mobileOpen} />
      </button>

      {/* ── Mobile overlay ───────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ───────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[240px] bg-background flex flex-col
          transition-transform duration-300 shadow-xl md:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center gap-2 px-6 py-5 border-b border-muted/20">
          <span className="w-8 h-8 rounded-btn bg-primary flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 7.2C20 16.5 12 21 12 21z"
              />
            </svg>
          </span>
          <span className="font-jakarta font-bold text-text text-base">
            {clinicName}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <NavList onClickItem={() => setMobileOpen(false)} />
        </div>
      </aside>

      {/* ── Desktop sidebar ───────────────────────── */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-[240px] bg-background z-30">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-muted/20">
          <span className="w-8 h-8 rounded-btn bg-primary flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 7.2C20 16.5 12 21 12 21z"
              />
            </svg>
          </span>
          <span className="font-jakarta font-bold text-text text-base">
            {clinicName}
          </span>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4">
          <NavList />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-muted/20 flex flex-col gap-2">
          <button
            onClick={() => onSignOut?.()}
            className="flex items-center gap-2 text-sm text-text hover:text-primary transition-colors"
          >
            <IconLogOut size={18} />
            Sign Out
          </button>

          <p className="text-xs text-muted font-dm">
            Outreach System v1.0
          </p>
        </div>
      </aside>
    </>
  );
}