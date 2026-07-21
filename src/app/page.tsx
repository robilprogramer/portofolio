"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mail, Menu, X } from "lucide-react";

// Hooks & Context
import {
  useProfile,
  useFeaturedProjects,
  useSkills,
  useExperience,
  useEducation,
  useSocialLinks,
  useTrackPageView,
} from "@/hooks/fe/useApi";
import { useTranslation } from "@/lib/contexts/settings-context";
import { EducationData, ExperienceData, ProfileData, ProjectData, SkillData, SocialLinkData } from "@/types/fe/portfolio";
import { LoadingSpinner } from "@/components/fe/ui/loading-spinner";
import { HeroSection } from "@/components/fe/sections/hero-section";
import { AboutSection } from "@/components/fe/sections/about-section";
import { SectionCard } from "@/components/fe/ui/section-card";
import { ProjectsSection } from "@/components/fe/sections/projects-section";
import { ExperienceSection } from "@/components/fe/sections/experience-section";
import { SkillsSection } from "@/components/fe/sections/skills-section";
import { SettingsDropdown } from "@/components/settings-dropdown";
import { HeroAboutSection } from "@/components/fe/sections/HeroAboutSection";


// Components
// Sections

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  // Data Fetching
  const { data: profileRaw, isLoading: profileLoading } = useProfile();
  const { data: projectsRaw, isLoading: projectsLoading } = useFeaturedProjects(); 
  const { data: skillsRaw, isLoading: skillsLoading } = useSkills();
  const { data: experiencesRaw, isLoading: experienceLoading } = useExperience();
  const { data: educationRaw, isLoading: educationLoading } = useEducation();
  const { data: socialLinksRaw } = useSocialLinks();
  const { mutate: trackPageView } = useTrackPageView();

  // Type Casting
  const profile = profileRaw as ProfileData | undefined;
  const featuredProjects = projectsRaw as ProjectData[] | undefined;
  const skills = skillsRaw as SkillData[] | undefined;
  const experiences = experiencesRaw as ExperienceData[] | undefined;
  const education = educationRaw as EducationData[] | undefined;
  const socialLinks = socialLinksRaw as SocialLinkData[] | undefined;

  useEffect(() => {
    trackPageView("/");
  }, [trackPageView]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: t("nav.about") },
    { href: "#projects", label: t("nav.projects") },
    { href: "#skills", label: t("nav.skills") },
    { href: "#experience", label: t("nav.experience") },
    { href: "#contact", label: t("nav.contact") },
  ];

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800">
      {/* NAVIGATION BAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800" : "bg-transparent"}`}>
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="font-bold text-xl tracking-tight">
            {profile?.name || "Robil"}.
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <SettingsDropdown />
            <Link href="/admin" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
              {t("nav.admin")}
            </Link>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-zinc-500">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 p-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 pt-24 pb-24">
        {/* {profile && <HeroSection profile={profile} socialLinks={socialLinks} t={t} />}
        {profile && <AboutSection profile={profile} t={t} />} */}
        {profile && <HeroAboutSection profile={profile} socialLinks={socialLinks} t={t} />}

        {projectsLoading ? <SectionCard><LoadingSpinner /></SectionCard> : <ProjectsSection projects={featuredProjects} t={t} />}
        {skillsLoading ? <SectionCard><LoadingSpinner /></SectionCard> : <SkillsSection skills={skills} t={t} />}
        {experienceLoading || educationLoading ? <SectionCard><LoadingSpinner /></SectionCard> : <ExperienceSection experiences={experiences} education={education} t={t} />}

        {/* Contact Section */}
        <SectionCard id="contact" className="text-center bg-zinc-900 dark:bg-zinc-100 border-none">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-white dark:text-zinc-900">{t("contact.title")}</h2>
          <p className="text-zinc-400 dark:text-zinc-600 mb-8">{t("contact.description")}</p>
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-3 rounded-full bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white px-8 py-4 text-sm font-medium hover:scale-105 transition-transform">
              <Mail className="h-5 w-5" /> {profile.email}
            </a>
          )}
        </SectionCard>
      </main>

      <footer className="text-center py-8 text-sm text-zinc-500 border-t border-zinc-200 dark:border-zinc-800">
        © {new Date().getFullYear()} {profile?.name || "Robil"}. All rights reserved.
      </footer>
    </div>
  );
}