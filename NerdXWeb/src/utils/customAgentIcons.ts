import { type ElementType } from 'react';
import {
  BookOpen,
  Brain,
  Calculator,
  ClipboardCheck,
  ClipboardList,
  FlaskConical,
  Globe,
  GraduationCap,
  LineChart,
  MessageCircle,
  Monitor,
  PenLine,
  Sparkles,
  Target,
} from 'lucide-react';

export const CUSTOM_AGENT_ICONS = {
  Sparkles,
  Brain,
  Calculator,
  FlaskConical,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  LineChart,
  PenLine,
  Target,
  MessageCircle,
  Monitor,
  Globe,
} as const satisfies Record<string, ElementType>;

export type CustomAgentIconKey = keyof typeof CUSTOM_AGENT_ICONS;

export const CUSTOM_AGENT_ICON_OPTIONS = Object.keys(CUSTOM_AGENT_ICONS) as CustomAgentIconKey[];

