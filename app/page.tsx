"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Icons ───────────────────────────────────────────────────────────────────

const IconPaw = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);
const IconCalendar = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconMapPin = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconPhone = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 .84h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 5.93 5.93l1.23-1.23a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
  </svg>
);
const IconFacebook = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const IconClock = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconScissors = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);
const IconSyringe = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2L22 6" /><path d="M7 11l-5 5 1 3 3 1 5-5" /><path d="M21.3 8.7l-8-8-9 9 8 8 1.4-1.4-1-1L14 14l-1.4 1.4-1-1 2.1-2.1-1.4-1.4-2.1 2.1-1-1L11 10.6l-1.4-1.4 2.1-2.1L10.3 5.7z" />
  </svg>
);
const IconStethoscope = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" />
  </svg>
);
const IconShield = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconArrowRight = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconMenu = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconX = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconCheck = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconHeart = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconUsers = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconStar = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Programs", href: "#programs" },
  { label: "Contact", href: "#contact" },
];

const SERVICES = [
  { icon: <IconStethoscope size={22} />, title: "General Consultation", description: "Comprehensive checkups and health evaluations for your pets." },
  { icon: <IconSyringe size={22} />, title: "Vaccination", description: "Complete immunization programs to keep your pets protected." },
  { icon: <IconScissors size={22} />, title: "Spay & Neuter (Kapon)", description: "Affordable surgical procedures to control pet overpopulation.", featured: true },
  { icon: <IconShield size={22} />, title: "Preventive Care", description: "Proactive health management and disease prevention services." },
  { icon: <IconSyringe size={22} />, title: "Diagnosis & Treatment", description: "Accurate diagnostics and effective treatment for all conditions." },
  { icon: <IconHeart size={22} />, title: "Surgical Procedures", description: "Safe, professional surgical services for your beloved pets." },
];

const STEPS = [
  { number: "01", title: "Register Online", description: "Fill out the registration form for your pet before the event or sign up on-site." },
  { number: "02", title: "Pet Evaluation", description: "Our veterinary team checks and evaluates each pet to confirm eligibility." },
  { number: "03", title: "Surgery", description: "Qualified pets undergo the spay or neuter procedure by our licensed vets." },
  { number: "04", title: "Post-Op Care", description: "Owners receive complete aftercare instructions and follow-up support." },
];

const STATS = [
  { value: "500+", label: "Pets Served" },
  { value: "20+", label: "Outreach Events" },
  { value: "10+", label: "Barangays Reached" },
  { value: "100%", label: "Community Focus" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ["home", "about", "services", "programs", "contact"];
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --p: #6D28D9;
          --p-mid: #7C3AED;
          --p-light: #8B5CF6;
          --p-ghost: rgba(109,40,217,0.08);
          --p-tint: #F5F0FF;
          --g: #65C547;
          --g-dark: #4CAF30;
          --g-ghost: rgba(101,197,71,0.12);
          --g-tint: #F0FAE8;
          --bg: #F7F4FB;
          --surface: #FFFFFF;
          --ink: #1E1330;
          --ink-2: #4B4160;
          --ink-3: #8A7FA8;
          --border: rgba(109,40,217,0.10);
          --border-soft: rgba(109,40,217,0.06);
          --shadow-sm: 0 1px 4px rgba(109,40,217,0.06), 0 4px 16px rgba(109,40,217,0.04);
          --shadow-md: 0 4px 24px rgba(109,40,217,0.10), 0 1px 4px rgba(109,40,217,0.06);
          --shadow-lg: 0 8px 40px rgba(109,40,217,0.14), 0 2px 8px rgba(109,40,217,0.06);
          --radius: 14px;
          --radius-lg: 20px;
          --radius-xl: 28px;
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--ink);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        h1,h2,h3,h4,h5 { font-family: 'Sora', sans-serif; }

        /* ── Grain overlay ── */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.018;
          pointer-events: none;
          z-index: 9999;
        }

        /* ══════════════════════ NAVBAR ══════════════════════ */
        .nav {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 200;
          padding: 18px 0;
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
        }

        .nav.scrolled {
          padding: 10px 0;
          background: rgba(247,244,251,0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-soft);
          box-shadow: var(--shadow-sm);
        }

        .nav-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          cursor: pointer;
          flex-shrink: 0;
        }

        .nav-logo-mark {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, var(--p), var(--p-light));
          border-radius: 10px;
          display: grid;
          place-items: center;
          color: white;
          box-shadow: 0 2px 10px rgba(109,40,217,0.3);
          flex-shrink: 0;
        }

        .nav-logo-text { line-height: 1.15; }
        .nav-logo-name {
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: var(--p);
          letter-spacing: -0.2px;
        }
        .nav-logo-sub {
          font-size: 10.5px;
          color: var(--ink-3);
          font-weight: 400;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          list-style: none;
        }

        .nav-link {
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--ink-2);
          cursor: pointer;
          transition: all 0.18s;
          text-decoration: none;
          letter-spacing: -0.1px;
        }

        .nav-link:hover { color: var(--p); background: var(--p-ghost); }
        .nav-link.active { color: var(--p); background: var(--p-ghost); font-weight: 600; }

        .nav-actions { display: flex; align-items: center; gap: 8px; }

        .nav-login {
          padding: 8px 18px;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--p);
          border: 1.5px solid var(--border);
          background: transparent;
          text-decoration: none;
          transition: all 0.18s;
          letter-spacing: -0.1px;
        }
        .nav-login:hover { background: var(--p-ghost); border-color: var(--p-light); }

        .nav-cta {
          padding: 9px 20px;
          background: linear-gradient(135deg, var(--p), var(--p-light));
          color: white;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          letter-spacing: -0.1px;
          box-shadow: 0 2px 12px rgba(109,40,217,0.25);
        }
        .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(109,40,217,0.35); }

        .nav-burger {
          display: none;
          background: none;
          border: none;
          color: var(--ink);
          cursor: pointer;
          padding: 4px;
        }

        /* ── Mobile drawer ── */
        .drawer-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(14,6,28,0.45);
          z-index: 200;
          backdrop-filter: blur(4px);
        }
        .drawer-overlay.open { display: block; }

        .drawer {
          position: fixed;
          top: 0; right: -100%; bottom: 0;
          width: min(340px, 88vw);
          background: var(--surface);
          z-index: 201;
          transition: right 0.35s cubic-bezier(0.4,0,0.2,1);
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: -8px 0 48px rgba(109,40,217,0.12);
        }
        .drawer.open { right: 0; }

        .drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-soft);
        }

        .drawer-close {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: var(--p-ghost);
          border: none;
          cursor: pointer;
          display: grid;
          place-items: center;
          color: var(--p);
        }

        .drawer-link {
          padding: 14px 16px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 500;
          color: var(--ink-2);
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'Sora', sans-serif;
        }
        .drawer-link:hover { background: var(--p-ghost); color: var(--p); }

        .drawer-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 20px;
          border-top: 1px solid var(--border-soft);
        }

        .drawer-login {
          padding: 14px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          color: var(--p);
          border: 1.5px solid var(--border);
          text-align: center;
          text-decoration: none;
          font-family: 'Sora', sans-serif;
        }

        .drawer-cta {
          padding: 16px;
          background: linear-gradient(135deg, var(--p), var(--p-light));
          color: white;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          font-family: 'Sora', sans-serif;
          box-shadow: 0 4px 20px rgba(109,40,217,0.3);
        }

        /* ══════════════════════ HERO ══════════════════════ */
        .hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 130px 0 90px;
        }

        /* Mesh gradient background */
        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 50%, #3B0764 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 20%, #4C1D95 0%, transparent 55%),
            radial-gradient(ellipse 50% 50% at 60% 80%, #1E0A40 0%, transparent 50%),
            linear-gradient(160deg, #0F0720 0%, #1E0845 40%, #2D1060 70%, #150530 100%);
        }

        /* Ambient glow orbs */
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
        }
        .hero-orb-1 {
          width: 500px; height: 500px;
          top: -150px; right: -100px;
          background: rgba(139,92,246,0.18);
        }
        .hero-orb-2 {
          width: 320px; height: 320px;
          bottom: -60px; left: -80px;
          background: rgba(101,197,71,0.10);
        }
        .hero-orb-3 {
          width: 200px; height: 200px;
          top: 40%; left: 40%;
          background: rgba(124,58,237,0.12);
          filter: blur(40px);
        }

        /* Subtle dot grid */
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }

        /* Top fade for navbar blend */
        .hero-fade-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 140px;
          background: linear-gradient(to bottom, rgba(14,6,28,0.55), transparent);
          pointer-events: none;
        }

        .hero-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 28px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(101,197,71,0.12);
          border: 1px solid rgba(101,197,71,0.28);
          color: #86efac;
          padding: 7px 14px 7px 10px;
          border-radius: 100px;
          font-size: 12.5px;
          font-weight: 600;
          margin-bottom: 22px;
          letter-spacing: 0.2px;
          width: fit-content;
        }

        .hero-badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--g);
          box-shadow: 0 0 0 3px rgba(101,197,71,0.2);
          animation: pulse-dot 2.4s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 3px rgba(101,197,71,0.2); }
          50% { box-shadow: 0 0 0 6px rgba(101,197,71,0.08); }
        }

        .hero-title {
          font-size: clamp(2.2rem, 4.5vw, 3.4rem);
          font-weight: 800;
          color: white;
          line-height: 1.1;
          letter-spacing: -1.5px;
          margin-bottom: 18px;
        }

        .hero-title-accent { color: var(--g); }

        .hero-desc {
          font-size: 15.5px;
          line-height: 1.75;
          color: rgba(255,255,255,0.62);
          margin-bottom: 36px;
          max-width: 460px;
          font-weight: 300;
        }

        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }

        .btn-hero-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 26px;
          background: linear-gradient(135deg, var(--g-dark), var(--g));
          color: #0F2D06;
          border-radius: 11px;
          font-size: 14.5px;
          font-weight: 700;
          font-family: 'Sora', sans-serif;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.22s;
          box-shadow: 0 4px 20px rgba(101,197,71,0.35);
          letter-spacing: -0.2px;
        }
        .btn-hero-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(101,197,71,0.45);
        }

        .btn-hero-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 26px;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.88);
          border-radius: 11px;
          font-size: 14.5px;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.14);
          cursor: pointer;
          transition: all 0.22s;
          letter-spacing: -0.2px;
        }
        .btn-hero-ghost:hover {
          background: rgba(255,255,255,0.13);
          transform: translateY(-2px);
        }

        /* Hero glass card */
        .hero-card {
          background: rgba(255,255,255,0.055);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: var(--radius-xl);
          padding: 28px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .hero-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 20px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .hero-card-icon {
          width: 46px; height: 46px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--g-dark), var(--g));
          display: grid;
          place-items: center;
          color: #0F2D06;
          flex-shrink: 0;
        }

        .hero-card-label {
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: white;
          line-height: 1.3;
        }
        .hero-card-sub {
          font-size: 11.5px;
          color: rgba(255,255,255,0.45);
          margin-top: 2px;
        }

        .hero-card-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 11px 0;
        }
        .hero-card-row + .hero-card-row {
          border-top: 1px solid rgba(255,255,255,0.055);
        }
        .hero-card-row-label {
          font-size: 12.5px;
          color: rgba(255,255,255,0.5);
        }
        .hero-card-row-val {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: white;
        }
        .row-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .hero-card-btn {
          margin-top: 20px;
          display: block;
          padding: 13px;
          background: rgba(101,197,71,0.12);
          border: 1px solid rgba(101,197,71,0.22);
          border-radius: 10px;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: #86efac;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }
        .hero-card-btn:hover { background: rgba(101,197,71,0.2); }

        /* ══════════════════════ STATS ══════════════════════ */
        .stats {
          background: linear-gradient(135deg, var(--p), var(--p-mid));
          position: relative;
          overflow: hidden;
        }
        .stats::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .stats-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 28px;
          display: grid;
          grid-template-columns: repeat(4,1fr);
          position: relative;
          z-index: 1;
        }
        .stat-item {
          text-align: center;
          padding: 36px 16px;
          border-right: 1px solid rgba(255,255,255,0.10);
          transition: background 0.2s;
        }
        .stat-item:last-child { border-right: none; }
        .stat-item:hover { background: rgba(255,255,255,0.04); }
        .stat-val {
          font-family: 'Sora', sans-serif;
          font-size: 2.1rem;
          font-weight: 800;
          color: var(--g);
          line-height: 1;
          margin-bottom: 7px;
          letter-spacing: -1px;
        }
        .stat-lbl {
          font-size: 12.5px;
          color: rgba(255,255,255,0.58);
          letter-spacing: 0.2px;
        }

        /* ══════════════════════ SECTION BASE ══════════════════════ */
        .sec { padding: 100px 0; }
        .sec-alt { background: var(--surface); }

        .sec-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 28px;
        }

        .sec-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--p);
          margin-bottom: 10px;
        }

        .sec-title {
          font-size: clamp(1.75rem, 3vw, 2.4rem);
          font-weight: 800;
          color: var(--ink);
          line-height: 1.2;
          letter-spacing: -0.8px;
          margin-bottom: 14px;
        }

        .sec-desc {
          font-size: 15.5px;
          line-height: 1.72;
          color: var(--ink-2);
          max-width: 540px;
          font-weight: 400;
        }

        .sec-head { margin-bottom: 52px; }

        /* ══════════════════════ ABOUT ══════════════════════ */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 72px;
          align-items: center;
        }

        .about-feat {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 22px 0;
          border-bottom: 1px solid var(--border-soft);
        }
        .about-feat:last-child { border-bottom: none; }

        .about-feat-icon {
          width: 44px; height: 44px;
          border-radius: 11px;
          background: var(--p-tint);
          color: var(--p);
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 1px solid var(--border);
        }

        .about-feat-title {
          font-size: 14.5px;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 4px;
          font-family: 'Sora', sans-serif;
          letter-spacing: -0.2px;
        }
        .about-feat-desc {
          font-size: 13.5px;
          color: var(--ink-2);
          line-height: 1.65;
        }

        /* Mission card */
        .mission-card {
          background: linear-gradient(145deg, #3B0764, #4C1D95);
          border-radius: var(--radius-xl);
          padding: 36px;
          color: white;
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
        }
        .mission-card::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: rgba(139,92,246,0.2);
          pointer-events: none;
        }
        .mission-card::after {
          content: '';
          position: absolute;
          bottom: -60px; left: -20px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(101,197,71,0.06);
          pointer-events: none;
        }
        .mission-eyebrow {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 10px;
        }
        .mission-text {
          font-size: 15px;
          line-height: 1.72;
          color: rgba(255,255,255,0.88);
          position: relative;
          z-index: 1;
        }
        .mission-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.1);
          margin: 20px 0;
        }

        .info-card {
          background: var(--bg);
          border-radius: var(--radius-lg);
          padding: 8px 20px;
          border: 1px solid var(--border-soft);
        }
        .info-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 0;
          font-size: 13.5px;
          color: var(--ink-2);
          border-bottom: 1px solid var(--border-soft);
        }
        .info-row:last-child { border-bottom: none; }
        .info-row svg { color: var(--p); flex-shrink: 0; }

        /* ══════════════════════ SERVICES ══════════════════════ */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 18px;
        }

        .svc-card {
          background: var(--surface);
          border-radius: var(--radius-lg);
          padding: 28px;
          border: 1px solid var(--border-soft);
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .svc-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--p-ghost), transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .svc-card:hover { border-color: var(--border); transform: translateY(-3px); box-shadow: var(--shadow-md); }
        .svc-card:hover::before { opacity: 1; }

        .svc-icon {
          width: 50px; height: 50px;
          border-radius: 12px;
          background: var(--p-tint);
          color: var(--p);
          display: grid;
          place-items: center;
          margin-bottom: 20px;
          border: 1px solid var(--border);
          transition: all 0.25s;
          position: relative;
          z-index: 1;
        }
        .svc-card:hover .svc-icon { background: var(--p); color: white; border-color: var(--p); }

        .svc-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 8px;
          font-family: 'Sora', sans-serif;
          letter-spacing: -0.3px;
          position: relative;
          z-index: 1;
        }
        .svc-desc {
          font-size: 13.5px;
          color: var(--ink-2);
          line-height: 1.65;
          position: relative;
          z-index: 1;
        }

        /* Featured svc */
        .svc-card-featured {
          background: linear-gradient(145deg, var(--p), var(--p-mid));
          border-color: transparent;
        }
        .svc-card-featured::before { display: none; }
        .svc-card-featured:hover { border-color: transparent; box-shadow: var(--shadow-lg); }
        .svc-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(101,197,71,0.18);
          border: 1px solid rgba(101,197,71,0.3);
          color: #86efac;
          font-size: 10.5px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 100px;
          margin-bottom: 14px;
          letter-spacing: 0.3px;
          position: relative; z-index: 1;
        }
        .svc-card-featured .svc-icon { background: rgba(255,255,255,0.15); color: white; border-color: rgba(255,255,255,0.15); }
        .svc-card-featured:hover .svc-icon { background: rgba(255,255,255,0.22); color: white; border-color: rgba(255,255,255,0.22); }
        .svc-card-featured .svc-title { color: white; }
        .svc-card-featured .svc-desc { color: rgba(255,255,255,0.72); }

        /* ══════════════════════ PROGRAMS ══════════════════════ */
        .programs-hero {
          background: var(--p-tint);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 44px;
          margin-bottom: 44px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .programs-hero::before {
          content: '';
          position: absolute;
          top: -80px; right: 200px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: rgba(109,40,217,0.05);
          pointer-events: none;
        }

        .elig-list { display: flex; flex-direction: column; gap: 10px; margin-top: 22px; }
        .elig-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--ink-2);
        }
        .elig-check {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: var(--g-tint);
          border: 1px solid rgba(101,197,71,0.25);
          display: grid;
          place-items: center;
          color: var(--g-dark);
          flex-shrink: 0;
        }

        .register-box {
          background: linear-gradient(145deg, var(--p), var(--p-mid));
          border-radius: var(--radius-lg);
          padding: 32px 28px;
          text-align: center;
          color: white;
          min-width: 210px;
          box-shadow: var(--shadow-lg);
          position: relative;
          z-index: 1;
        }
        .register-box-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: rgba(255,255,255,0.13);
          display: grid;
          place-items: center;
          margin: 0 auto 16px;
          color: white;
        }
        .register-box-title {
          font-family: 'Sora', sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
          letter-spacing: -0.3px;
        }
        .register-box-desc {
          font-size: 12.5px;
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
          margin-bottom: 22px;
        }
        .register-box-btn {
          display: block;
          padding: 13px 20px;
          background: white;
          color: var(--p);
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 700;
          text-decoration: none;
          font-family: 'Sora', sans-serif;
          transition: all 0.2s;
          letter-spacing: -0.2px;
        }
        .register-box-btn:hover { background: var(--g); color: #0F2D06; }

        .steps-heading {
          font-family: 'Sora', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 22px;
          letter-spacing: -0.3px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 18px;
        }

        .step-card {
          background: var(--surface);
          border-radius: var(--radius-lg);
          padding: 28px 22px;
          border: 1px solid var(--border-soft);
          position: relative;
          overflow: hidden;
          transition: all 0.22s;
        }
        .step-card:hover { border-color: var(--border); transform: translateY(-2px); box-shadow: var(--shadow-sm); }

        .step-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--g);
          margin-bottom: 16px;
          box-shadow: 0 0 0 3px rgba(101,197,71,0.15);
        }

        .step-num {
          font-family: 'Sora', sans-serif;
          font-size: 2.8rem;
          font-weight: 800;
          color: rgba(109,40,217,0.07);
          line-height: 1;
          margin-bottom: 10px;
          letter-spacing: -3px;
        }

        .step-title {
          font-family: 'Sora', sans-serif;
          font-size: 14.5px;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 7px;
          letter-spacing: -0.2px;
        }
        .step-desc {
          font-size: 13px;
          color: var(--ink-2);
          line-height: 1.65;
        }

        /* ══════════════════════ CONTACT ══════════════════════ */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 44px;
          align-items: start;
        }

        .contact-card {
          background: var(--surface);
          border-radius: var(--radius-xl);
          padding: 32px;
          border: 1px solid var(--border-soft);
          box-shadow: var(--shadow-sm);
        }

        .contact-card-title {
          font-family: 'Sora', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 3px;
          letter-spacing: -0.3px;
        }
        .contact-card-sub {
          font-size: 13px;
          color: var(--ink-3);
          margin-bottom: 6px;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 18px 0;
          border-bottom: 1px solid var(--border-soft);
        }
        .contact-item:last-of-type { border-bottom: none; }

        .contact-icon {
          width: 42px; height: 42px;
          border-radius: 11px;
          background: var(--p-tint);
          color: var(--p);
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 1px solid var(--border);
        }

        .contact-lbl {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: var(--ink-3);
          margin-bottom: 4px;
        }
        .contact-val {
          font-size: 14.5px;
          font-weight: 500;
          color: var(--ink);
          line-height: 1.55;
        }

        .fb-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          padding: 15px;
          background: #1877F2;
          color: white;
          border-radius: 11px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
          text-decoration: none;
          margin-top: 20px;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }
        .fb-btn:hover { background: #1558c0; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(24,119,242,0.3); }

        .map-panel {
          background: var(--surface);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-soft);
          box-shadow: var(--shadow-sm);
          min-height: 340px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 48px 32px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .map-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 60% at 50% 40%, var(--p-tint), transparent);
          pointer-events: none;
        }
        .map-pin-wrap {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: var(--p-tint);
          border: 1px solid var(--border);
          display: grid;
          place-items: center;
          color: var(--p);
          position: relative;
          z-index: 1;
        }
        .map-eyebrow {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--ink-3);
          position: relative; z-index: 1;
        }
        .map-address {
          font-size: 14.5px;
          font-weight: 500;
          color: var(--ink);
          line-height: 1.6;
          max-width: 240px;
          position: relative; z-index: 1;
        }
        .map-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--p);
          text-decoration: none;
          padding: 10px 20px;
          background: var(--p-tint);
          border: 1px solid var(--border);
          border-radius: 9px;
          transition: all 0.2s;
          position: relative; z-index: 1;
          font-family: 'Sora', sans-serif;
        }
        .map-link:hover { background: var(--p); color: white; }

        /* ══════════════════════ FOOTER ══════════════════════ */
        .footer {
          background: #0A0117;
          color: rgba(255,255,255,0.5);
          padding: 56px 0 32px;
          position: relative;
          overflow: hidden;
        }
        .footer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent);
        }
        .footer::after {
          content: '';
          position: absolute;
          top: -120px; left: 50%;
          transform: translateX(-50%);
          width: 500px; height: 200px;
          border-radius: 50%;
          background: rgba(109,40,217,0.06);
          filter: blur(40px);
          pointer-events: none;
        }

        .footer-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 28px;
          position: relative;
          z-index: 1;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 56px;
          padding-bottom: 44px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 28px;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .footer-brand-mark {
          width: 34px; height: 34px;
          border-radius: 8px;
          background: rgba(101,197,71,0.12);
          display: grid;
          place-items: center;
          color: var(--g);
          border: 1px solid rgba(101,197,71,0.2);
        }
        .footer-brand-name {
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.2px;
        }
        .footer-desc {
          font-size: 13px;
          line-height: 1.75;
          max-width: 270px;
        }

        .footer-col-title {
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: white;
          margin-bottom: 16px;
          letter-spacing: 0.2px;
        }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-link {
          font-size: 13px;
          color: rgba(255,255,255,0.48);
          cursor: pointer;
          transition: color 0.18s;
        }
        .footer-link:hover { color: var(--g); }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
        }

        .footer-hours {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
        }

        /* ══════════════════════ RESPONSIVE ══════════════════════ */
        @media (max-width: 1024px) {
          .hero-inner { grid-template-columns: 1fr; }
          .hero-card { display: none; }
          .about-grid { grid-template-columns: 1fr; gap: 40px; }
          .services-grid { grid-template-columns: repeat(2,1fr); }
          .programs-hero { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: repeat(2,1fr); }
          .contact-grid { grid-template-columns: 1fr; }
          .footer-top { grid-template-columns: 1fr 1fr; }
          .stats-inner { grid-template-columns: repeat(2,1fr); }
          .stat-item:nth-child(2) { border-right: none; }
          .stat-item:nth-child(3) { border-right: 1px solid rgba(255,255,255,0.1); border-top: 1px solid rgba(255,255,255,0.1); }
          .stat-item:nth-child(4) { border-top: 1px solid rgba(255,255,255,0.1); }
        }

        @media (max-width: 768px) {
          .nav-links, .nav-actions { display: none; }
          .nav-burger { display: block; }
          .sec { padding: 68px 0; }
          .services-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .footer-top { grid-template-columns: 1fr; gap: 32px; }
          .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
          .hero { padding: 110px 0 64px; }
          .programs-hero { padding: 28px 24px; }
        }

        @media (max-width: 480px) {
          .hero-actions { flex-direction: column; }
          .btn-hero-primary, .btn-hero-ghost { width: 100%; justify-content: center; }
          .stats-inner { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => scrollTo("#home")}>
            <div className="nav-logo-mark"><IconPaw size={18} /></div>
            <div className="nav-logo-text">
              <div className="nav-logo-name">Northern Hills Vet</div>
              <div className="nav-logo-sub">Caloocan City, Metro Manila</div>
            </div>
          </div>

          <ul className="nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <span
                  className={`nav-link ${activeSection === item.href.replace("#", "") ? "active" : ""}`}
                  onClick={() => scrollTo(item.href)}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <Link href="/auth/login" className="nav-login">Login</Link>
            <Link href="/events" className="nav-cta">Sign Up</Link>
          </div>

          <button className="nav-burger" onClick={() => setMenuOpen(true)}>
            <IconMenu size={22} />
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div className={`drawer-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <div className={`drawer ${menuOpen ? "open" : ""}`}>
        <div className="drawer-head">
          <div className="nav-logo">
            <div className="nav-logo-mark"><IconPaw size={16} /></div>
            <div className="nav-logo-text">
              <div className="nav-logo-name">Northern Hills Vet</div>
            </div>
          </div>
          <button className="drawer-close" onClick={() => setMenuOpen(false)}>
            <IconX size={18} />
          </button>
        </div>
        {NAV_ITEMS.map((item) => (
          <div key={item.href} className="drawer-link" onClick={() => scrollTo(item.href)}>
            {item.label}
          </div>
        ))}
        <div className="drawer-footer">
          <Link href="/auth/login" className="drawer-login">Login</Link>
          <Link href="/events" className="drawer-cta">Sign Up for Event</Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <section id="home" className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-fade-top" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="hero-inner">
          <div>
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Community Veterinary Care
            </div>
            <h1 className="hero-title">
              Affordable Care for<br />
              Every <span className="hero-title-accent">Pet</span> in<br />
              Our Community
            </h1>
            <p className="hero-desc">
              Northern Hills Veterinary Clinic provides accessible, quality veterinary services and runs low-cost spay & neuter outreach programs across Caloocan City and nearby barangays.
            </p>
            <div className="hero-actions">
              <button className="btn-hero-primary" onClick={() => scrollTo("#programs")}>
                <IconCalendar size={16} />
                Join Outreach Event
              </button>
              <button className="btn-hero-ghost" onClick={() => scrollTo("#about")}>
                Learn More
                <IconArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-top">
              <div className="hero-card-icon"><IconScissors size={20} /></div>
              <div>
                <div className="hero-card-label">Spay & Neuter Program</div>
                <div className="hero-card-sub">Next outreach event — register now</div>
              </div>
            </div>
            {[
              { label: "Service Type", value: "Spay & Neuter (Kapon)", dot: "#65C547" },
              { label: "Walk-ins", value: "Accepted", dot: "#65C547" },
              { label: "Fee", value: "Low-cost / Subsidized", dot: "#8B5CF6" },
              { label: "Location", value: "Various Barangays", dot: "#6D28D9" },
            ].map(({ label, value, dot }) => (
              <div className="hero-card-row" key={label}>
                <span className="hero-card-row-label">{label}</span>
                <span className="hero-card-row-val">
                  <span className="row-dot" style={{ background: dot }} />
                  {value}
                </span>
              </div>
            ))}
            <div className="hero-card-btn" onClick={() => scrollTo("#programs")}>
              View Upcoming Events →
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="stats">
        <div className="stats-inner">
          {STATS.map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-val">{s.value}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── About ── */}
      <section id="about" className="sec sec-alt">
        <div className="sec-inner">
          <div className="about-grid">
            <div>
              <div className="sec-eyebrow"><IconStar size={11} /> About the Clinic</div>
              <h2 className="sec-title">Serving Our Community Since Day One</h2>
              <p className="sec-desc">
                Northern Hills Veterinary Clinic is a community-focused facility based in Caloocan City. We believe every pet deserves quality healthcare, regardless of an owner&apos;s financial situation.
              </p>
              <div style={{ marginTop: 32 }}>
                {[
                  { icon: <IconUsers size={19} />, title: "Community-First Approach", desc: "Serving low-income pet owners with subsidized services and outreach programs across Metro Manila." },
                  { icon: <IconScissors size={19} />, title: "High-Volume Spay & Neuter", desc: "Running large-scale kapon events to reduce stray population and improve community animal welfare." },
                  { icon: <IconShield size={19} />, title: "Responsible Pet Ownership", desc: "Educating pet owners on preventive care, vaccinations, and long-term animal health management." },
                ].map(({ icon, title, desc }) => (
                  <div className="about-feat" key={title}>
                    <div className="about-feat-icon">{icon}</div>
                    <div>
                      <div className="about-feat-title">{title}</div>
                      <div className="about-feat-desc">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mission-card">
                <div className="mission-eyebrow">Our Mission</div>
                <p className="mission-text">
                  To provide accessible, affordable, and quality veterinary care while promoting responsible pet ownership in the community.
                </p>
                <hr className="mission-divider" />
                <div className="mission-eyebrow">Our Vision</div>
                <p className="mission-text">
                  To become a trusted veterinary service provider known for community outreach, animal welfare, and reliable pet healthcare.
                </p>
              </div>
              <div className="info-card">
                {[
                  { icon: <IconClock size={15} />, text: <><strong style={{ color: "var(--ink)", fontWeight: 600 }}>Daily:</strong> 10:00 AM – 6:00 PM</> },
                  { icon: <IconMapPin size={15} />, text: "Adeline Arcade, Unit 12, Quirino Highway, Barangay 182, Caloocan City" },
                  { icon: <IconPhone size={15} />, text: "+63 927 867 8760" },
                  { icon: <IconFacebook size={15} />, text: "Northern Hills Veterinary Clinic" },
                ].map(({ icon, text }, i) => (
                  <div className="info-row" key={i}>{icon}<span>{text}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="sec">
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-eyebrow"><IconPaw size={11} /> What We Offer</div>
            <h2 className="sec-title">Complete Veterinary Services</h2>
            <p className="sec-desc">From routine checkups to surgical procedures — comprehensive pet healthcare at prices the community can afford.</p>
          </div>
          <div className="services-grid">
            {SERVICES.map((svc, i) => (
              <div key={svc.title} className={`svc-card ${svc.featured ? "svc-card-featured" : ""}`}>
                {svc.featured && <div className="svc-badge"><IconStar size={9} /> Signature Program</div>}
                <div className="svc-icon">{svc.icon}</div>
                <div className="svc-title">{svc.title}</div>
                <div className="svc-desc">{svc.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programs ── */}
      <section id="programs" className="sec sec-alt">
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-eyebrow"><IconHeart size={11} /> Outreach Program</div>
            <h2 className="sec-title">Spay & Neuter Outreach Events</h2>
            <p className="sec-desc">We conduct regular kapon events in communities across Caloocan City — open to pre-registered and walk-in participants.</p>
          </div>

          <div className="programs-hero">
            <div style={{ position: "relative", zIndex: 1 }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "var(--ink)", marginBottom: 12, letterSpacing: "-0.4px" }}>
                Why Join Our Outreach?
              </h3>
              <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.72 }}>
                Our low-cost spay and neuter program helps control pet overpopulation, prevents unwanted litters, and improves the long-term health of your pets — all while supporting responsible pet ownership in our community.
              </p>
              <div className="elig-list">
                {[
                  "Open to dogs and cats",
                  "Low-cost or fully subsidized fees",
                  "Walk-in participants accepted",
                  "Conducted in various barangays",
                  "Post-operative care instructions provided",
                ].map((item) => (
                  <div className="elig-item" key={item}>
                    <div className="elig-check"><IconCheck size={11} /></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="register-box">
              <div className="register-box-icon"><IconCalendar size={24} /></div>
              <div className="register-box-title">Join an Event</div>
              <div className="register-box-desc">View upcoming outreach schedules and register your pet online.</div>
              <Link href="/events" className="register-box-btn">See Upcoming Events</Link>
            </div>
          </div>

          <div className="steps-heading">How It Works</div>
          <div className="steps-grid">
            {STEPS.map((step) => (
              <div className="step-card" key={step.number}>
                <div className="step-dot" />
                <div className="step-num">{step.number}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="sec">
        <div className="sec-inner">
          <div className="sec-head">
            <div className="sec-eyebrow"><IconMapPin size={11} /> Find Us</div>
            <h2 className="sec-title">Get in Touch</h2>
            <p className="sec-desc">Visit us at our clinic or reach out through Facebook. We&apos;re here daily from 10 AM to 6 PM.</p>
          </div>

          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-card-title">Contact Information</div>
              <div className="contact-card-sub">We&apos;d love to hear from you</div>

              {[
                { icon: <IconMapPin size={17} />, label: "Address", value: "Adeline Arcade, Unit 12, Quirino Highway\nBarangay 182, Caloocan City, Metro Manila" },
                { icon: <IconPhone size={17} />, label: "Phone", value: "+63 927 867 8760" },
                { icon: <IconClock size={17} />, label: "Operating Hours", value: "Daily: 10:00 AM – 6:00 PM" },
              ].map(({ icon, label, value }) => (
                <div className="contact-item" key={label}>
                  <div className="contact-icon">{icon}</div>
                  <div>
                    <div className="contact-lbl">{label}</div>
                    <div className="contact-val" style={{ whiteSpace: "pre-line" }}>{value}</div>
                  </div>
                </div>
              ))}

              <a href="https://www.facebook.com/NorthernHillsVeterinaryClinic" target="_blank" rel="noopener noreferrer" className="fb-btn">
                <IconFacebook size={17} />
                Northern Hills Veterinary Clinic on Facebook
              </a>
            </div>

            <div className="map-panel">
              <div className="map-pin-wrap"><IconMapPin size={26} /></div>
              <div className="map-eyebrow">Our Location</div>
              <div className="map-address">Adeline Arcade, Unit 12, Quirino Highway, Barangay 182, Caloocan City</div>
              <a href="https://maps.google.com/?q=Northern+Hills+Veterinary+Clinic+Caloocan+City" target="_blank" rel="noopener noreferrer" className="map-link">
                <IconMapPin size={13} />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand">
                <div className="footer-brand-mark"><IconPaw size={16} /></div>
                <span className="footer-brand-name">Northern Hills Veterinary Clinic</span>
              </div>
              <p className="footer-desc">
                Providing accessible, affordable, and quality veterinary care while promoting responsible pet ownership in Caloocan City and beyond.
              </p>
            </div>
            <div>
              <div className="footer-col-title">Quick Links</div>
              <ul className="footer-links">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <span className="footer-link" onClick={() => scrollTo(item.href)}>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Services</div>
              <ul className="footer-links">
                {["General Consultation", "Vaccination", "Spay & Neuter", "Surgical Procedures", "Preventive Care"].map((s) => (
                  <li key={s}><span className="footer-link">{s}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Northern Hills Veterinary Clinic. All rights reserved.</span>
            <div className="footer-hours">
              <IconClock size={11} />
              Open Daily: 10:00 AM – 6:00 PM
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}