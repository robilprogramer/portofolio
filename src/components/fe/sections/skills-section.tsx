"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { SkillData, TranslationFn } from "@/types/fe/portfolio";
import { SectionCard } from "../ui/section-card";

interface SkillsSectionProps {
  skills?: SkillData[];
  t: TranslationFn;
}

export function SkillsSection({ skills, t }: SkillsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  if (!skills?.length) return null;

  const INITIAL_COUNT = 6;
  const displayedSkills = showAll ? skills : skills.slice(0, INITIAL_COUNT);

  return (
    <SectionCard id="skills">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-10">{t("skills.title")} {t("skills.title2")}</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayedSkills.map((skill) => (
          <div key={skill.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-white">{skill.name}</h3>
                <p className="text-xs text-zinc-500">{skill.category}</p>
              </div>
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">{skill.level}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-1000 ease-out" style={{ width: `${skill.level}%` }} />
            </div>
          </div>
        ))}
      </div>

      {skills.length > INITIAL_COUNT && (
        <div className="mt-8 flex justify-center">
          <button onClick={() => setShowAll(!showAll)} className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-2.5 text-sm font-medium text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            {showAll ? "Show Less" : "Show More"}
            {showAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      )}
    </SectionCard>
  );
}