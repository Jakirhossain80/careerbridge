import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Cloud,
  Code2,
  Headphones,
  HeartPulse,
  Megaphone,
  Palette,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import type { CategoryIconKey } from "@/lib/categories-data";

export const categoryIcons = {
  code: Code2,
  chart: BarChart3,
  briefcase: BriefcaseBusiness,
  design: Palette,
  support: Headphones,
  megaphone: Megaphone,
  shield: ShieldCheck,
  book: BookOpen,
  heart: HeartPulse,
  bank: Building2,
  cloud: Cloud,
  users: UsersRound,
} satisfies Record<CategoryIconKey, typeof Code2>;
