import Image from "next/image";
import { Zap, Layers, Code2, Star } from "lucide-react";
import { ProfileData, TranslationFn } from "@/types/fe/portfolio";
import { SectionCard } from "../ui/section-card";

interface AboutSectionProps {
  profile: ProfileData;
  t: TranslationFn;
}

export function AboutSection({ profile, t }: AboutSectionProps) {
  return (
    <SectionCard id="about">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative mx-auto w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <Image src={profile.avatar} alt={profile.name} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{t("about.title")}</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">{profile.bio}</p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { icon: Zap, label: t("about.feature.fast") },
              { icon: Layers, label: t("about.feature.clean") },
              { icon: Code2, label: t("about.feature.modern") },
              { icon: Star, label: t("about.feature.best") },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <item.icon className="h-5 w-5 text-zinc-500" />
                <span className="font-medium text-sm text-zinc-900 dark:text-white">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}