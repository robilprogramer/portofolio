"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Github,
  Mail,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Code2,
  Layers,
  Zap,
  Download,
  MapPin,
  Calendar,
  Send,
  Menu,
  X,
  GraduationCap,
  Award,
  Star,
  Loader2,
} from "lucide-react";
import {
  useProfile,
  useFeaturedProjects,
  useSkills,
  useExperience,
  useEducation,
  useFeaturedTestimonials,
  useSocialLinks,
  useTrackPageView,
} from "@/hooks/fe/useApi";
import { getSocialIcon, getEmploymentTypeIcon } from "@/lib/fe/icons";
import { useTranslation } from "@/lib/contexts/settings-context";
import {
  SettingsDropdown,
  SettingsCompact,
} from "@/components/settings-dropdown";

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function GlowingOrb({ className }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 dark:opacity-30 animate-pulse ${className}`}
    />
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
      <p className="text-red-500 dark:text-red-400">{message}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Translation hook
  const { t } = useTranslation();

  // Fetch all data
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useProfile();
  const { data: featuredProjects, isLoading: projectsLoading } =
    useFeaturedProjects(3);
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: experiences, isLoading: experienceLoading } = useExperience();
  const { data: education, isLoading: educationLoading } = useEducation();
  const { data: testimonials, isLoading: testimonialsLoading } =
    useFeaturedTestimonials();
  const { data: socialLinks, isLoading: socialLinksLoading } = useSocialLinks();

  const fullName = profile?.name || "Robil";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(fullName.slice(0, index + 1));
      index++;
      if (index === fullName.length) clearInterval(interval);
    }, 200); // 200ms per letter

    return () => clearInterval(interval);
  }, [fullName]);
  // Track page view
  const { mutate: trackPageView } = useTrackPageView();

  useEffect(() => {
    trackPageView("/");
  }, [trackPageView]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Update active section
      const sections = [
        "hero",
        "about",
        "projects",
        "skills",
        "experience",
        "contact",
      ];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: t("nav.about") },
    { href: "#projects", label: t("nav.projects") },
    { href: "#skills", label: t("nav.skills") },
    { href: "#experience", label: t("nav.experience") },
    { href: "#contact", label: t("nav.contact") },
  ];

  // Combine experience and education for timeline
  const timeline = [
    ...(experiences || []).map((exp) => ({
      type: "experience" as const,
      title: exp.title,
      company: exp.company,
      period: `${new Date(exp.startDate).getFullYear()} - ${exp.isCurrent ? "Present" : new Date(exp.endDate!).getFullYear()}`,
      description: exp.description,
      icon: getEmploymentTypeIcon(exp.employmentType || "FULL_TIME"),
    })),
    ...(education || []).map((edu) => ({
      type: "education" as const,
      title: edu.degree,
      company: edu.institution,
      period: `${new Date(edu.startDate).getFullYear()} - ${edu.isCurrent ? "Present" : new Date(edu.endDate!).getFullYear()}`,
      description: `${edu.field}${edu.gpa ? ` • GPA: ${edu.gpa}` : ""}`,
      icon: GraduationCap,
    })),
  ].sort((a, b) => {
    const yearA = parseInt(a.period.split(" - ")[0]);
    const yearB = parseInt(b.period.split(" - ")[0]);
    return yearB - yearA;
  });

  if (profileError) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-6">
        <ErrorMessage message={t("common.error")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-x-hidden transition-colors duration-300">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* NAVIGATION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/50"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="relative group">
            <span className="text-2xl font-black tracking-tighter">
              <span className="bg-linear-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                {displayText}
              </span>
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-violet-500 to-cyan-500 group-hover:w-full transition-all duration-300" />
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  activeSection === link.href.slice(1)
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-linear-to-r from-violet-500 to-cyan-500" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {/* Settings Dropdown */}
            <SettingsDropdown />

            <Link
              href="/admin"
              className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {t("nav.admin")}
            </Link>
            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-full bg-linear-to-r from-violet-600 to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-violet-500/40 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  {t("nav.resume")}
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-cyan-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/50 transition-all duration-300 ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="block text-lg font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {t("nav.admin")}
            </Link>
            {/* Mobile Settings */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <SettingsCompact />
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center px-6 pt-20"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <GlowingOrb className="top-1/4 -left-32 w-96 h-96 bg-violet-500" />
          <GlowingOrb className="bottom-1/4 -right-32 w-96 h-96 bg-cyan-500" />
          <GlowingOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-fuchsia-500 opacity-5 dark:opacity-10" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {profileLoading ? (
            <LoadingSpinner />
          ) : profile ? (
            <>
              {/* Status Badge */}
              {profile.isAvailable && (
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 mb-8 animate-fade-in">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {t("hero.available")}
                  </span>
                </div>
              )}

              {/* Main Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-[0.9] tracking-tight">
                <span className="block text-zinc-900 dark:text-zinc-100">
                  {t("hero.greeting")}
                </span>
                <span className="block mt-2 bg-linear-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent pb-2">
                  {profile.name}
                </span>
              </h1>

              {/* Subtitle */}
              <div className="mt-6 flex items-center justify-center gap-3 text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400">
                <Code2 className="h-6 w-6 text-violet-500" />
                <span className="font-light">{profile.title}</span>
              </div>

              {/* Tagline */}
              <p className="mt-8 text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
                {profile.tagline}
              </p>

              {/* CTA Buttons */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="#projects"
                  className="group relative overflow-hidden rounded-full bg-linear-to-r from-violet-600 to-cyan-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-violet-500/30 transition-all duration-300 hover:shadow-violet-500/50 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t("hero.cta.work")}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-cyan-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
                <Link
                  href="#contact"
                  className="group flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 px-8 py-4 text-base font-semibold text-zinc-700 dark:text-zinc-300 backdrop-blur-sm transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
                >
                  <Mail className="h-5 w-5" />
                  {t("hero.cta.contact")}
                </Link>
              </div>

              {/* Social Links */}
              {!socialLinksLoading && socialLinks && socialLinks.length > 0 && (
                <div className="mt-16 flex items-center justify-center gap-4">
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform);
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 text-zinc-500 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/50 hover:text-violet-500 hover:scale-110 hover:shadow-lg hover:shadow-violet-500/20"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Stats */}
              <div className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto">
                {[
                  {
                    value: profile.yearsExperience,
                    label: t("hero.stats.years"),
                    suffix: "+",
                  },
                  {
                    value: profile.projectsCompleted,
                    label: t("hero.stats.projects"),
                    suffix: "+",
                  },
                  {
                    value: profile.happyClients,
                    label: t("hero.stats.clients"),
                    suffix: "+",
                  },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl font-black bg-linear-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                      />
                    </div>
                    <div className="mt-2 text-sm text-zinc-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-500">
            <span className="text-xs uppercase tracking-widest">
              {t("hero.scroll")}
            </span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ABOUT SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="about" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {profileLoading ? (
            <LoadingSpinner />
          ) : profile ? (
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Image Side */}
              <div className="relative">
                <div className="relative aspect-square max-w-lg mx-auto">
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -left-4 w-full h-full border border-violet-500/30 rounded-3xl" />
                  <div className="absolute -bottom-4 -right-4 w-full h-full bg-linear-to-br from-violet-500/20 to-cyan-500/20 rounded-3xl" />

                  {/* Main image container */}
                  <div className="relative w-full h-full rounded-3xl overflow-hidden bg-linear-to-br from-violet-600 to-cyan-600 p-1">
                    <div className="w-full h-full rounded-[22px] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      <Image
                        src={profile.avatar}
                        alt={profile.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Floating badges */}
                  <div className="absolute -top-6 -right-6 flex items-center gap-2 rounded-2xl bg-white dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 px-4 py-3 shadow-xl">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-semibold text-zinc-700 dark:text-white">
                      Creative Developer
                    </span>
                  </div>
                  <div className="absolute -bottom-6 -left-6 flex items-center gap-2 rounded-2xl bg-white dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 px-4 py-3 shadow-xl">
                    <MapPin className="h-5 w-5 text-violet-500" />
                    <span className="text-sm font-semibold text-zinc-700 dark:text-white">
                      {profile.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="space-y-8">
                <div>
                  <span className="inline-flex items-center gap-2 text-violet-500 text-sm font-semibold uppercase tracking-widest">
                    <Sparkles className="h-4 w-4" />
                    {t("about.label")}
                  </span>
                  <h2 className="mt-4 text-4xl sm:text-5xl font-black leading-tight text-zinc-900 dark:text-white">
                    {t("about.title")}
                    <span className="block text-zinc-400 dark:text-zinc-500">
                      {t("about.title2")}
                    </span>
                  </h2>
                </div>

                <div className="space-y-4 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  <p>{profile.bio}</p>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Zap, label: t("about.feature.fast") },
                    { icon: Layers, label: t("about.feature.clean") },
                    { icon: Code2, label: t("about.feature.modern") },
                    { icon: Star, label: t("about.feature.best") },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 text-violet-500 font-semibold hover:text-violet-600 dark:hover:text-violet-400 transition-colors group"
                >
                  {t("about.cta")}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* PROJECTS SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="projects"
        className="relative py-32 px-6 bg-zinc-100/50 dark:bg-zinc-900/50"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 text-violet-500 text-sm font-semibold uppercase tracking-widest">
              <Layers className="h-4 w-4" />
              {t("projects.label")}
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white">
              {t("projects.title")}{" "}
              <span className="text-zinc-400 dark:text-zinc-500">
                {t("projects.title2")}
              </span>
            </h2>
            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              {t("projects.description")}
            </p>
          </div>

          {/* Projects Grid */}
          {projectsLoading ? (
            <LoadingSpinner />
          ) : featuredProjects && featuredProjects.length > 0 ? (
            <>
              <div className="grid gap-8 lg:grid-cols-3">
                {featuredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group relative rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-500 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2"
                  >
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        fill
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span
                          className={`inline-flex items-center rounded-full bg-linear-to-r ${project.color || "from-violet-500 to-purple-600"} px-3 py-1 text-xs font-semibold text-white`}
                        >
                          {project.category}
                        </span>
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-900 hover:bg-violet-500 hover:text-white transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-900 hover:bg-violet-500 hover:text-white transition-colors"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-violet-500 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {project.shortDesc}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="mt-16 text-center">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 px-8 py-4 text-base font-semibold text-zinc-700 dark:text-zinc-300 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/50 hover:text-zinc-900 dark:hover:text-white hover:shadow-lg hover:shadow-violet-500/20"
                >
                  {t("projects.viewAll")}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center text-zinc-500">{t("projects.empty")}</p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SKILLS SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="skills" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 text-violet-500 text-sm font-semibold uppercase tracking-widest">
              <Zap className="h-4 w-4" />
              {t("skills.label")}
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white">
              {t("skills.title")}{" "}
              <span className="text-zinc-400 dark:text-zinc-500">
                {t("skills.title2")}
              </span>
            </h2>
            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              {t("skills.description")}
            </p>
          </div>

          {/* Skills Grid */}
          {skillsLoading ? (
            <LoadingSpinner />
          ) : skills && skills.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 transition-all duration-300 hover:border-violet-500/50 hover:bg-white dark:hover:bg-zinc-900"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {skill.icon && (
                        <span className="text-2xl">{skill.icon}</span>
                      )}
                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white">
                          {skill.name}
                        </h3>
                        <p className="text-xs text-zinc-500">
                          {skill.category}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-violet-500">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-violet-500 to-cyan-500 transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-zinc-500">{t("skills.empty")}</p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* EXPERIENCE SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="experience"
        className="relative py-32 px-6 bg-zinc-100/50 dark:bg-zinc-900/50"
      >
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 text-violet-500 text-sm font-semibold uppercase tracking-widest">
              <Award className="h-4 w-4" />
              {t("experience.label")}
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white">
              {t("experience.title")}{" "}
              <span className="text-zinc-400 dark:text-zinc-500">
                {t("experience.title2")}
              </span>
            </h2>
          </div>

          {/* Timeline */}
          {experienceLoading || educationLoading ? (
            <LoadingSpinner />
          ) : timeline.length > 0 ? (
            <div className="relative">
              {/* Line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-linear-to-b from-violet-500 via-violet-500/50 to-transparent" />

              {/* Items */}
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div key={index} className="relative flex gap-8">
                    {/* Icon */}
                    <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <item.icon className="h-6 w-6 text-violet-500" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-6 transition-all duration-300 hover:border-violet-500/30 hover:bg-white dark:hover:bg-zinc-900">
                      <div className="flex flex-wrap items-center gap-4 justify-between mb-2">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                          {item.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-sm text-zinc-500">
                          <Calendar className="h-4 w-4" />
                          {item.period}
                        </span>
                      </div>
                      <p className="text-violet-500 font-medium mb-2">
                        {item.company}
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-zinc-500">{t("experience.empty")}</p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TESTIMONIALS SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {!testimonialsLoading && testimonials && testimonials.length > 0 && (
        <section className="relative py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 text-violet-500 text-sm font-semibold uppercase tracking-widest">
                <Star className="h-4 w-4" />
                {t("testimonials.label")}
              </span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white">
                {t("testimonials.title")}{" "}
                <span className="text-zinc-400 dark:text-zinc-500">
                  {t("testimonials.title2")}
                </span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 p-8 transition-all duration-300 hover:border-violet-500/30"
                >
                  {/* Quote Icon */}
                  <div className="absolute -top-4 -left-2 text-6xl text-violet-500/20 font-serif">
                    &ldquo;
                  </div>

                  <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                    {testimonial.content}
                  </p>

                  <div className="flex items-center gap-4">
                    {testimonial.avatar && (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-violet-500/30"
                        fill
                      />
                    )}
                    <div>
                      <p className="font-semibold text-zinc-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {testimonial.role}
                        {testimonial.company && ` • ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CONTACT SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="contact"
        className="relative py-32 px-6 bg-zinc-100/50 dark:bg-zinc-900/50"
      >
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-violet-500 text-sm font-semibold uppercase tracking-widest">
            <Send className="h-4 w-4" />
            {t("contact.label")}
          </span>
          <h2 className="mt-4 text-4xl sm:text-6xl font-black leading-tight text-zinc-900 dark:text-white">
            {t("contact.title")}
            <span className="block bg-linear-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              {t("contact.title2")}
            </span>
          </h2>
          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            {t("contact.description")}
          </p>

          {!profileLoading && profile && (
            <div className="mt-12">
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-3 rounded-full bg-linear-to-r from-violet-600 to-cyan-600 px-10 py-5 text-lg font-semibold text-white shadow-2xl shadow-violet-500/30 transition-all duration-300 hover:shadow-violet-500/50 hover:scale-105"
              >
                <Mail className="h-6 w-6" />
                {profile.email}
              </a>
            </div>
          )}

          {!socialLinksLoading && socialLinks && socialLinks.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 transition-all duration-300 hover:border-violet-500/50 hover:text-violet-500 hover:scale-110"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright & Name */}
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} {profile?.name || "Robil"}. All rights
            reserved.
            <span className="hidden sm:inline">
              Full Stack Developer | React & Node.js | Cloud Solutions
            </span>
          </p>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
