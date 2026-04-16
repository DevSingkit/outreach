"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';

// ─── Icon Components ──────────────────────────────────────────────────────────

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

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
}

interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface StepItem {
  number: string;
  title: string;
  description: string;
}

interface StatItem {
  value: string;
  label: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Programs", href: "#programs" },
  { label: "Contact", href: "#contact" },
];

const SERVICES: ServiceItem[] = [
  {
    icon: <IconStethoscope size={24} />,
    title: "General Consultation",
    description: "Comprehensive checkups and health evaluations for your pets.",
  },
  {
    icon: <IconSyringe size={24} />,
    title: "Vaccination",
    description: "Complete immunization programs to keep your pets protected.",
  },
  {
    icon: <IconScissors size={24} />,
    title: "Spay & Neuter (Kapon)",
    description: "Affordable surgical procedures to control pet overpopulation.",
  },
  {
    icon: <IconShield size={24} />,
    title: "Preventive Care",
    description: "Proactive health management and disease prevention services.",
  },
  {
    icon: <IconPaw size={24} />,
    title: "Diagnosis & Treatment",
    description: "Accurate diagnostics and effective treatment for all conditions.",
  },
  {
    icon: <IconHeart size={24} />,
    title: "Surgical Procedures",
    description: "Safe, professional surgical services for your beloved pets.",
  },
];

const STEPS: StepItem[] = [
  {
    number: "01",
    title: "Register Online",
    description: "Fill out the registration form for your pet before the event or sign up on-site.",
  },
  {
    number: "02",
    title: "Pet Evaluation",
    description: "Our veterinary team checks and evaluates each pet to confirm eligibility.",
  },
  {
    number: "03",
    title: "Surgery",
    description: "Qualified pets undergo the spay or neuter procedure by our licensed vets.",
  },
  {
    number: "04",
    title: "Post-Op Care",
    description: "Owners receive complete aftercare instructions and follow-up support.",
  },
];

const STATS: StatItem[] = [
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
      for (const section of sections.reverse()) {
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
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Be+Vietnam+Pro:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --primary: #7B2CBF;
          --primary-hover: #A66DD4;
          --primary-light: #F3E8FF;
          --secondary: #7ED957;
          --secondary-dark: #5BB832;
          --secondary-light: #E8F8E0;
          --bg: #EDEDED;
          --surface: #FFFFFF;
          --text: #3A3A3A;
          --text-muted: #A8A8A8;
          --text-soft: #6B6B6B;
          --border: rgba(123, 44, 191, 0.12);
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'Be Vietnam Pro', sans-serif;
          background-color: var(--bg);
          color: var(--text);
          overflow-x: hidden;
        }

        h1, h2, h3, h4 {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ── Navbar ── */
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          transition: all 0.3s ease;
          padding: 16px 0;
        }

        .navbar.scrolled {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 1px 0 rgba(123,44,191,0.08);
          padding: 12px 0;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          cursor: pointer;
        }

        .nav-logo-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, var(--primary), var(--primary-hover));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .nav-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .nav-logo-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: -0.2px;
        }

        .nav-logo-sub {
          font-size: 10px;
          color: var(--text-muted);
          font-weight: 400;
          letter-spacing: 0.3px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
        }

        .nav-link {
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-soft);
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .nav-link:hover, .nav-link.active {
          color: var(--primary);
          background: var(--primary-light);
        }

        .nav-cta {
          padding: 10px 22px;
          background: linear-gradient(135deg, var(--primary), var(--primary-hover));
          color: white;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(123,44,191,0.3);
        }

        .nav-mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text);
          padding: 4px;
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: white;
          z-index: 99;
          padding: 80px 24px 40px;
          flex-direction: column;
          gap: 8px;
        }

        .mobile-menu.open { display: flex; }

        .mobile-menu-link {
          padding: 16px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .mobile-menu-link:hover {
          background: var(--primary-light);
          color: var(--primary);
        }

        .mobile-menu-cta {
          margin-top: 16px;
          padding: 18px;
          background: linear-gradient(135deg, var(--primary), var(--primary-hover));
          color: white;
          border-radius: 14px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .mobile-menu-close {
          position: absolute;
          top: 20px; right: 20px;
          background: #f5f5f5;
          border: none;
          border-radius: 50%;
          width: 44px; height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text);
        }

        /* ── Hero ── */
        .hero {
          min-height: 100vh;
          background: linear-gradient(160deg, #1a0230 0%, var(--primary) 45%, #4a1070 70%, #2d0650 100%);
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 120px 0 80px;
        }

        .hero-bg-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(126, 217, 87, 0.06);
          pointer-events: none;
        }

        .hero-bg-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(126, 217, 87, 0.15);
          border: 1px solid rgba(126, 217, 87, 0.3);
          color: var(--secondary);
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 24px;
          width: fit-content;
          letter-spacing: 0.3px;
        }

        .hero-title {
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          font-weight: 800;
          color: white;
          line-height: 1.1;
          letter-spacing: -1px;
          margin-bottom: 20px;
        }

        .hero-title-accent {
          color: var(--secondary);
        }

        .hero-desc {
          font-size: 16px;
          line-height: 1.7;
          color: rgba(255,255,255,0.72);
          margin-bottom: 36px;
          max-width: 480px;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-primary {
          padding: 14px 28px;
          background: linear-gradient(135deg, var(--secondary-dark), var(--secondary));
          color: #1A3A00;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(126,217,87,0.4);
        }

        .btn-ghost {
          padding: 14px 28px;
          background: rgba(255,255,255,0.1);
          color: white;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .btn-ghost:hover {
          background: rgba(255,255,255,0.18);
          transform: translateY(-2px);
        }

        /* Hero card */
        .hero-card {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          padding: 32px;
          color: white;
        }

        .hero-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .hero-card-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, var(--secondary-dark), var(--secondary));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1A3A00;
          flex-shrink: 0;
        }

        .hero-card-title {
          font-size: 15px;
          font-weight: 700;
          line-height: 1.3;
        }

        .hero-card-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.55);
          margin-top: 2px;
        }

        .hero-card-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
        }

        .hero-card-stat + .hero-card-stat {
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .hero-card-stat-label {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
        }

        .hero-card-stat-value {
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stat-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .hero-card-cta {
          margin-top: 24px;
          padding: 14px;
          background: rgba(126,217,87,0.15);
          border: 1px solid rgba(126, 217, 87, 0.25);
          border-radius: 12px;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: var(--secondary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .hero-card-cta:hover {
          background: rgba(126,217,87,0.25);
        }

        /* ── Stats ── */
        .stats-section {
          background: var(--primary);
          padding: 40px 0;
        }

        .stats-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }

        .stat-item {
          text-align: center;
          padding: 16px;
          border-right: 1px solid rgba(255,255,255,0.12);
        }

        .stat-item:last-child { border-right: none; }

        .stat-value {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: var(--secondary);
          line-height: 1;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          font-weight: 400;
        }

        /* ── Section shared ── */
        .section {
          padding: 96px 0;
        }

        .section-alt {
          background: var(--surface);
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--primary);
          margin-bottom: 12px;
        }

        .section-title {
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 800;
          color: var(--text);
          line-height: 1.2;
          letter-spacing: -0.5px;
          margin-bottom: 16px;
        }

        .section-desc {
          font-size: 16px;
          line-height: 1.7;
          color: var(--text-soft);
          max-width: 560px;
        }

        .section-head {
          margin-bottom: 56px;
        }

        /* ── About ── */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }

        .about-feature {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .about-feature:last-child { border-bottom: none; }

        .about-feature-icon {
          width: 44px; height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: var(--primary-light);
          color: var(--primary);
        }

        .about-feature-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 4px;
        }

        .about-feature-desc {
          font-size: 14px;
          color: var(--text-soft);
          line-height: 1.6;
        }

        .about-info-card {
          background: var(--bg);
          border-radius: 20px;
          padding: 32px;
          margin-top: 24px;
        }

        .about-info-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          font-size: 14px;
          color: var(--text-soft);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .about-info-row:last-child { border-bottom: none; }

        .about-info-row svg { color: var(--primary); flex-shrink: 0; }

        /* ── Services ── */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .service-card {
          background: var(--surface);
          border-radius: 16px;
          padding: 28px;
          transition: all 0.25s;
          border: 1px solid transparent;
          cursor: default;
        }

        .service-card:hover {
          border-color: var(--border);
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(123,44,191,0.08);
        }

        .service-card-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-light);
          color: var(--primary);
          margin-bottom: 20px;
          transition: all 0.25s;
        }

        .service-card:hover .service-card-icon {
          background: var(--primary);
          color: white;
        }

        .service-card-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 8px;
        }

        .service-card-desc {
          font-size: 14px;
          color: var(--text-soft);
          line-height: 1.6;
        }

        /* Featured service card */
        .service-card-featured {
          background: linear-gradient(135deg, var(--primary), var(--primary-hover));
          color: white;
          grid-column: span 1;
        }

        .service-card-featured .service-card-icon {
          background: rgba(255,255,255,0.15);
          color: white;
        }

        .service-card-featured:hover .service-card-icon {
          background: rgba(255,255,255,0.25);
          color: white;
        }

        .service-card-featured .service-card-title { color: white; }
        .service-card-featured .service-card-desc { color: rgba(255,255,255,0.75); }

        .service-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(126,217,87,0.2);
          border: 1px solid rgba(126,217,87,0.3);
          color: var(--secondary);
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 100px;
          margin-bottom: 16px;
          letter-spacing: 0.3px;
        }

        /* ── Programs ── */
        .programs-hero {
          background: linear-gradient(135deg, #f8f0ff, var(--primary-light));
          border-radius: 24px;
          padding: 48px;
          margin-bottom: 48px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 40px;
          align-items: center;
        }

        .programs-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .step-card {
          background: var(--surface);
          border-radius: 16px;
          padding: 28px 24px;
          position: relative;
          overflow: hidden;
        }

        .step-number {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 3rem;
          font-weight: 800;
          color: rgba(123,44,191,0.08);
          line-height: 1;
          margin-bottom: 12px;
          letter-spacing: -2px;
        }

        .step-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 8px;
        }

        .step-desc {
          font-size: 13px;
          color: var(--text-soft);
          line-height: 1.6;
        }

        .step-indicator {
          width: 6px; height: 6px;
          background: var(--secondary);
          border-radius: 50%;
          margin-bottom: 16px;
        }

        .eligibility-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 20px;
        }

        .eligibility-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--text-soft);
        }

        .eligibility-check {
          width: 22px; height: 22px;
          background: var(--secondary-light);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--secondary-dark);
          flex-shrink: 0;
        }

        .register-cta-box {
          background: linear-gradient(135deg, var(--primary), var(--primary-hover));
          border-radius: 16px;
          padding: 36px;
          text-align: center;
          color: white;
        }

        /* ── Contact ── */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }

        .contact-card {
          background: var(--surface);
          border-radius: 20px;
          padding: 32px;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px 0;
          border-bottom: 1px solid #f5f5f5;
        }

        .contact-item:last-child { border-bottom: none; }

        .contact-item-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .contact-item-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .contact-item-value {
          font-size: 15px;
          font-weight: 500;
          color: var(--text);
          line-height: 1.5;
        }

        .fb-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px;
          background: #1877F2;
          color: white;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          margin-top: 24px;
          transition: all 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
          text-decoration: none;
        }

        .fb-button:hover {
          background: #1558c0;
          transform: translateY(-1px);
        }

        .map-placeholder {
          background: var(--bg);
          border-radius: 20px;
          padding: 48px 32px;
          text-align: center;
          height: 100%;
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .map-pin-icon {
          width: 64px; height: 64px;
          background: var(--primary-light);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          margin-bottom: 8px;
        }

        .map-address {
          font-size: 15px;
          font-weight: 500;
          color: var(--text);
          line-height: 1.6;
          max-width: 260px;
          text-align: center;
        }

        .map-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: var(--primary);
          text-decoration: none;
          margin-top: 8px;
          padding: 10px 20px;
          background: var(--primary-light);
          border-radius: 10px;
          transition: all 0.2s;
        }

        .map-link:hover {
          background: var(--primary);
          color: white;
        }

        /* ── Footer ── */
        .footer {
          background: #1a0230;
          color: rgba(255,255,255,0.6);
          padding: 48px 0 32px;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 32px;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .footer-brand-icon {
          width: 36px; height: 36px;
          background: rgba(126,217,87,0.15);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--secondary);
        }

        .footer-brand-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: white;
        }

        .footer-desc {
          font-size: 13px;
          line-height: 1.7;
          max-width: 280px;
        }

        .footer-col-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: white;
          margin-bottom: 16px;
          letter-spacing: 0.3px;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-link {
          font-size: 13px;
          color: rgba(255,255,255,0.55);
          cursor: pointer;
          transition: color 0.2s;
        }

        .footer-link:hover { color: var(--secondary); }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
        }

        .footer-hours {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .hero-container { grid-template-columns: 1fr; gap: 40px; }
          .hero-card { display: none; }
          .about-grid { grid-template-columns: 1fr; }
          .services-grid { grid-template-columns: repeat(2, 1fr); }
          .programs-hero { grid-template-columns: 1fr; }
          .programs-steps { grid-template-columns: repeat(2, 1fr); }
          .contact-grid { grid-template-columns: 1fr; }
          .footer-top { grid-template-columns: 1fr 1fr; }
          .stats-container { grid-template-columns: repeat(2, 1fr); }
          .stat-item:nth-child(2) { border-right: none; }
          .stat-item:nth-child(3) { border-right: 1px solid rgba(255,255,255,0.12); border-top: 1px solid rgba(255,255,255,0.12); }
          .stat-item:nth-child(4) { border-top: 1px solid rgba(255,255,255,0.12); }
        }

        @media (max-width: 768px) {
          .nav-links, .nav-cta { display: none; }
          .nav-mobile-toggle { display: block; }
          .section { padding: 64px 0; }
          .services-grid { grid-template-columns: 1fr; }
          .programs-steps { grid-template-columns: 1fr; }
          .footer-top { grid-template-columns: 1fr; gap: 32px; }
          .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
          .hero { padding: 100px 0 60px; }
          .programs-hero { padding: 32px 24px; }
        }

        @media (max-width: 480px) {
          .hero-actions { flex-direction: column; }
          .btn-primary, .btn-ghost { width: 100%; justify-content: center; }
          .stats-container { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <div className="nav-logo" onClick={() => scrollTo("#home")}>
            <div className="nav-logo-icon">
              <IconPaw size={20} />
            </div>
            <div className="nav-logo-text">
              <span className="nav-logo-title">Northern Hills Vet</span>
              <span className="nav-logo-sub">Caloocan City, Metro Manila</span>
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

          <div style={{ display: "flex", gap: "10px" }}>
            <Link href="/auth/login" className="nav-link" style={{ fontWeight: 600 }}>
              Login
            </Link>

            <Link href="/events" className="nav-cta">
              Sign Up
            </Link>
          </div>

          <button className="nav-mobile-toggle" onClick={() => setMenuOpen(true)}>
            <IconMenu />
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>
          <IconX size={20} />
        </button>
        {NAV_ITEMS.map((item) => (
          <div key={item.href} className="mobile-menu-Link" onClick={() => scrollTo(item.href)}>
            {item.label}
          </div>
        ))}
        <Link href="/auth/login" className="mobile-menu-Link">Login</Link>
        <Link href="/events" className="mobile-menu-cta">Sign Up</Link>
      </div>

      {/* ── Hero ── */}
      <section id="home" className="hero">
        <div className="hero-bg-dots" />
        <div className="hero-bg-circle" style={{ width: 600, height: 600, top: -200, right: -200 }} />
        <div className="hero-bg-circle" style={{ width: 300, height: 300, bottom: -100, left: -50, background: "rgba(126,217,87,0.04)" }} />

        <div className="hero-container">
          <div>
            <div className="hero-badge">
              <IconHeart size={14} />
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
              <button className="btn-primary" onClick={() => scrollTo("#programs")}>
                <IconCalendar size={17} />
                Join Outreach Event
              </button>
              <button className="btn-ghost" onClick={() => scrollTo("#about")}>
                Learn More
                <IconArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Floating card */}
          <div className="hero-card">
            <div className="hero-card-header">
              <div className="hero-card-icon">
                <IconScissors size={22} />
              </div>
              <div>
                <div className="hero-card-title">Spay & Neuter Program</div>
                <div className="hero-card-sub">Next outreach event — register now</div>
              </div>
            </div>

            {[
              { label: "Service Type", value: "Spay & Neuter (Kapon)", dot: "#7ED957" },
              { label: "Walk-ins", value: "Accepted", dot: "#7ED957" },
              { label: "Fee", value: "Low-cost / Subsidized", dot: "#A66DD4" },
              { label: "Location", value: "Various Barangays", dot: "#7B2CBF" },
            ].map(({ label, value, dot }) => (
              <div className="hero-card-stat" key={label}>
                <span className="hero-card-stat-label">{label}</span>
                <span className="hero-card-stat-value">
                  <span className="stat-dot" style={{ background: dot }} />
                  {value}
                </span>
              </div>
            ))}

            <div className="hero-card-cta" onClick={() => scrollTo("#programs")}>
              View Upcoming Events →
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="stats-section">
        <div className="stats-container">
          {STATS.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── About ── */}
      <section id="about" className="section section-alt">
        <div className="section-container">
          <div className="about-grid">
            <div>
              <div className="section-label">
                <IconStar size={12} />
                About the Clinic
              </div>
              <h2 className="section-title">Serving Our Community Since Day One</h2>
              <p className="section-desc">
                Northern Hills Veterinary Clinic is a community-focused facility based in Caloocan City. We believe every pet deserves quality healthcare, regardless of an owner&apos;s financial situation.
              </p>

              <div style={{ marginTop: 32 }}>
                {[
                  { icon: <IconUsers size={20} />, title: "Community-First Approach", desc: "Serving low-income pet owners with subsidized services and outreach programs across Metro Manila." },
                  { icon: <IconScissors size={20} />, title: "High-Volume Spay & Neuter", desc: "Running large-scale kapon events to reduce stray population and improve community animal welfare." },
                  { icon: <IconShield size={20} />, title: "Responsible Pet Ownership", desc: "Educating pet owners on preventive care, vaccinations, and long-term animal health management." },
                ].map(({ icon, title, desc }) => (
                  <div className="about-feature" key={title}>
                    <div className="about-feature-icon">{icon}</div>
                    <div>
                      <div className="about-feature-title">{title}</div>
                      <div className="about-feature-desc">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ background: "linear-gradient(135deg, #7B2CBF, #A66DD4)", borderRadius: 20, padding: "40px 32px", color: "white", marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>Our Mission</div>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.9)" }}>
                  To provide accessible, affordable, and quality veterinary care while promoting responsible pet ownership in the community.
                </p>
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>Our Vision</div>
                  <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.9)" }}>
                    To become a trusted veterinary service provider known for community outreach, animal welfare, and reliable pet healthcare.
                  </p>
                </div>
              </div>

              <div className="about-info-card">
                <div className="about-info-row">
                  <IconClock size={16} />
                  <span><strong style={{ color: "#3A3A3A", fontWeight: 600 }}>Daily:</strong> 10:00 AM – 6:00 PM</span>
                </div>
                <div className="about-info-row">
                  <IconMapPin size={16} />
                  <span>Adeline Arcade, Unit 12, Quirino Highway, Barangay 182, Caloocan City</span>
                </div>
                <div className="about-info-row">
                  <IconPhone size={16} />
                  <span>+63 927 867 8760</span>
                </div>
                <div className="about-info-row">
                  <IconFacebook size={16} />
                  <span>Northern Hills Veterinary Clinic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="section">
        <div className="section-container">
          <div className="section-head">
            <div className="section-label">
              <IconPaw size={12} />
              What We Offer
            </div>
            <h2 className="section-title">Complete Veterinary Services</h2>
            <p className="section-desc">From routine checkups to surgical procedures — we provide comprehensive pet healthcare at prices the community can afford.</p>
          </div>

          <div className="services-grid">
            {SERVICES.map((service, i) => (
              <div
                key={service.title}
                className={`service-card ${i === 2 ? "service-card-featured" : ""}`}
              >
                {i === 2 && <div className="service-badge"><IconStar size={10} /> Signature Program</div>}
                <div className="service-card-icon">{service.icon}</div>
                <div className="service-card-title">{service.title}</div>
                <div className="service-card-desc">{service.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programs ── */}
      <section id="programs" className="section section-alt">
        <div className="section-container">
          <div className="section-head">
            <div className="section-label">
              <IconHeart size={12} />
              Outreach Program
            </div>
            <h2 className="section-title">Spay & Neuter Outreach Events</h2>
            <p className="section-desc">We conduct regular kapon events in communities across Caloocan City — open to pre-registered and walk-in participants.</p>
          </div>

          <div className="programs-hero">
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#3A3A3A", marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Why Join Our Outreach?
              </h3>
              <p style={{ fontSize: 15, color: "#6B6B6B", lineHeight: 1.7, marginBottom: 0 }}>
                Our low-cost spay and neuter program helps control pet overpopulation, prevents unwanted litters, and improves the long-term health of your pets — all while supporting responsible pet ownership in our community.
              </p>

              <div className="eligibility-list">
                {[
                  "Open to dogs and cats",
                  "Low-cost or fully subsidized fees",
                  "Walk-in participants accepted",
                  "Conducted in various barangays",
                  "Post-operative care instructions provided",
                ].map((item) => (
                  <div className="eligibility-item" key={item}>
                    <div className="eligibility-check"><IconCheck size={12} /></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="register-cta-box" style={{ minWidth: 220 }}>
              <div style={{ width: 56, height: 56, background: "rgba(255,255,255,0.15)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "white" }}>
                <IconCalendar size={26} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Join an Event
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", marginBottom: 24, lineHeight: 1.6 }}>
                View upcoming outreach schedules and register your pet online.
              </div>
              <Link href="/events" style={{ display: "block", padding: "14px 20px", background: "white", color: "#7B2CBF", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none", textAlign: "center", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                See Upcoming Events
              </Link>
            </div>
          </div>

          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#3A3A3A", marginBottom: 24, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>How It Works</h3>
          <div className="programs-steps">
            {STEPS.map((step) => (
              <div className="step-card" key={step.number}>
                <div className="step-indicator" />
                <div className="step-number">{step.number}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="section">
        <div className="section-container">
          <div className="section-head">
            <div className="section-label">
              <IconMapPin size={12} />
              Find Us
            </div>
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-desc">Visit us at our clinic or reach out through Facebook. We&apos;re here daily from 10 AM to 6 PM.</p>
          </div>

          <div className="contact-grid">
            <div className="contact-card">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#3A3A3A", marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Contact Information</h3>
              <p style={{ fontSize: 13, color: "#A8A8A8", marginBottom: 8 }}>We&apos;d love to hear from you</p>

              {[
                { icon: <IconMapPin size={18} />, label: "Address", value: "Adeline Arcade, Unit 12, Quirino Highway\nBarangay 182, Caloocan City, Metro Manila" },
                { icon: <IconPhone size={18} />, label: "Phone", value: "+63 927 867 8760" },
                { icon: <IconClock size={18} />, label: "Operating Hours", value: "Daily: 10:00 AM – 6:00 PM" },
              ].map(({ icon, label, value }) => (
                <div className="contact-item" key={label}>
                  <div className="contact-item-icon">{icon}</div>
                  <div>
                    <div className="contact-item-label">{label}</div>
                    <div className="contact-item-value" style={{ whiteSpace: "pre-line" }}>{value}</div>
                  </div>
                </div>
              ))}

              <a
                href="https://www.facebook.com/NorthernHillsVeterinaryClinic"
                target="_blank"
                rel="noopener noreferrer"
                className="fb-button"
              >
                <IconFacebook size={18} />
                Northern Hills Veterinary Clinic on Facebook
              </a>
            </div>

            <div className="map-placeholder">
              <div className="map-pin-icon">
                <IconMapPin size={28} />
              </div>
              <div style={{ fontSize: 13, color: "#A8A8A8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Our Location</div>
              <div className="map-address">
                Adeline Arcade, Unit 12, Quirino Highway, Barangay 182, Caloocan City
              </div>
              <a
                href="https://maps.google.com/?q=Northern+Hills+Veterinary+Clinic+Caloocan+City"
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
              >
                <IconMapPin size={14} />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div>
              <div className="footer-brand">
                <div className="footer-brand-icon">
                  <IconPaw size={18} />
                </div>
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
              <IconClock size={12} />
              Open Daily: 10:00 AM – 6:00 PM
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}