"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Code2, Mail, Zap, Layers, Star } from "lucide-react";
import { getSocialIcon } from "@/lib/fe/icons";
import {
  ProfileData,
  SocialLinkData,
  TranslationFn,
} from "@/types/fe/portfolio";
import { SectionCard } from "../ui/section-card";
import { AnimatedCounter } from "../ui/animated-counter";

interface HeroAboutSectionProps {
  profile: ProfileData;
  socialLinks?: SocialLinkData[];
  t: TranslationFn;
}

export function HeroAboutSection({
  profile,
  socialLinks,
  t,
}: HeroAboutSectionProps) {
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

  const features = [
    { icon: Zap, label: t("about.feature.fast") },
    { icon: Layers, label: t("about.feature.clean") },
    { icon: Code2, label: t("about.feature.modern") },
    { icon: Star, label: t("about.feature.best") },
  ];

  const stats = [
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
  ];

  return (
    <SectionCard id="hero" className="pt-32 pb-20">
      {/* ================= 1. Hero Section (Sapaan & Foto) ================= */}
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
        {/* Kiri: Teks Hero */}
        <div className="animate-fade-in-up text-center lg:text-left order-2 lg:order-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            {t("hero.greeting")}{" "}
            <span className="text-zinc-500">{displayText}</span>
            <span
              aria-hidden="true"
              className="inline-block w-0.5 h-[0.85em] bg-zinc-400 ml-1 align-middle animate-pulse motion-reduce:animate-none"
            />
          </h1>

          <div className="inline-flex items-center gap-2 text-lg text-zinc-600 dark:text-zinc-400 mb-8 font-medium bg-white dark:bg-zinc-950 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <Code2 className="h-5 w-5" />
            {profile.title}
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-row items-center lg:items-start gap-4 mb-8 justify-center lg:justify-start">
            <Link
              href="#projects"
              className="flex items-center gap-2 rounded-full bg-zinc-900 dark:bg-white px-8 py-3.5 text-sm font-medium text-white dark:text-zinc-900 transition-transform hover:scale-105 shadow-md"
            >
              {t("hero.cta.work")}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="#contact"
              className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-8 py-3.5 text-sm font-medium text-zinc-900 dark:text-white transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 shadow-sm"
            >
              <Mail className="h-4 w-4" />
              {t("hero.cta.contact")}
            </Link>
          </div>

          {socialLinks && socialLinks.length > 0 && (
            <div className="flex items-center justify-center lg:justify-start gap-6">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform);

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all hover:-translate-y-0.5"
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Kanan: Foto Profil */}
        <div className="flex justify-center lg:justify-end order-1 lg:order-2">
          <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-white dark:bg-zinc-950 border-4 border-white dark:border-zinc-900 shadow-xl">
            <Image
              src={profile.avatar}
              alt={profile.name}
              fill
              priority
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>

      {/* ================= 2. About Section (Bio & Fitur) ================= */}
      <div
        id="about"
        className="grid lg:grid-cols-2 gap-12 items-center scroll-mt-24 pt-16 border-t border-zinc-200 dark:border-zinc-800"
      >
        <div className="space-y-6 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {t("about.label")}
          </h2>

          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed text-justify">
            {profile.bio}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-transform hover:-translate-y-0.5 shadow-sm"
            >
              <item.icon className="h-5 w-5 text-zinc-500" />
              <span className="font-medium text-sm text-zinc-900 dark:text-white">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 3. Stats Section ================= */}
      <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto border-t border-zinc-200 dark:border-zinc-800 pt-12 mt-16">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </div>

            <div className="mt-2 text-xs lg:text-sm font-medium text-zinc-500 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
