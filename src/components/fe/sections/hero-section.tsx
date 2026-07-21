"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Code2, Mail } from "lucide-react";
import { getSocialIcon } from "@/lib/fe/icons";
import { ProfileData, SocialLinkData, TranslationFn } from "@/types/fe/portfolio";
import { SectionCard } from "../ui/section-card";
import { AnimatedCounter } from "../ui/animated-counter";

interface HeroSectionProps {
  profile: ProfileData;
  socialLinks?: SocialLinkData[];
  t: TranslationFn;
}

export function HeroSection({ profile, socialLinks, t }: HeroSectionProps) {
  const [displayText, setDisplayText] = useState("");
  const fullName = profile?.name || "Robil";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(fullName.slice(0, index + 1));
      index++;
      if (index === fullName.length) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, [fullName]);

  return (
    <SectionCard id="hero" className="min-h-[80vh] flex flex-col justify-center text-center pt-32">
      <div className="animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
          {t("hero.greeting")} <br className="hidden sm:block" />
          <span className="text-zinc-500">{displayText}</span>
        </h1>

        <div className="inline-flex items-center gap-2 text-lg text-zinc-600 dark:text-zinc-400 mb-8 font-medium bg-white dark:bg-zinc-950 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800">
          <Code2 className="h-5 w-5" />
          {profile.title}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="#projects" className="flex items-center gap-2 rounded-full bg-zinc-900 dark:bg-white px-8 py-3.5 text-sm font-medium text-white dark:text-zinc-900 transition-transform hover:scale-105">
            {t("hero.cta.work")} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="#contact" className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-8 py-3.5 text-sm font-medium text-zinc-900 dark:text-white transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <Mail className="h-4 w-4" />
            {t("hero.cta.contact")}
          </Link>
        </div>

        {socialLinks && socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-6 mb-16">
            {socialLinks.map((link) => {
              const Icon = getSocialIcon(link.platform);
              return (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto border-t border-zinc-200 dark:border-zinc-800 pt-12">
          {[
            { value: profile.yearsExperience, label: t("hero.stats.years"), suffix: "+" },
            { value: profile.projectsCompleted, label: t("hero.stats.projects"), suffix: "+" },
            { value: profile.happyClients, label: t("hero.stats.clients"), suffix: "+" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-2 text-xs font-medium text-zinc-500 uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}