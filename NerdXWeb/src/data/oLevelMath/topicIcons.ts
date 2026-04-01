import {
  Hash,
  Target,
  Percent,
  Binary,
  Ruler,
  CircleDot,
  Wallet,
  Clock,
  Box,
  LineChart,
  Sigma,
  Code,
  Superscript,
  Circle,
  Hexagon,
  Compass,
  Database,
  BarChart3,
  Navigation,
  Dice5,
  Triangle,
  Copy,
  Activity,
  MoveRight,
  FlipVertical2,
  FlipHorizontal2,
  RotateCw,
  Maximize2,
  MoveHorizontal,
  ArrowUpDown,
  Crosshair,
  Shuffle,
  Layers,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  LayoutGrid,
  Route,
  Gauge,
  Calculator,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

/** Unique icon per O-Level math topic name (used on topic list + topic hub). */
export function getMathTopicIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes('number concept') || (n.includes('number') && n.includes('operation'))) return Hash;
  if (n.includes('approximation') || n.includes('estimation') || n.includes('limits of accuracy')) return Target;
  if (n.includes('standard form') || n.includes('ordinary') || n.includes('large and small')) return ArrowUpDown;
  if (n.includes('number bases')) return Binary;
  if (n.includes('consumer') || n.includes('bills') || n.includes('exchange')) return Wallet;
  if (n.includes('venn')) return Layers;
  if (n.includes('set')) return CircleDot;
  if (n.includes('density')) return Gauge;
  if (n.includes('mensuration')) return Box;
  if (n.includes('scale')) return Ruler;
  if (n.includes('measures')) return Clock;
  if (n.includes('functional graph')) return LineChart;
  if (n.includes('travel graph')) return Route;
  if (n.includes('symbolic')) return Code;
  if (n.includes('logarithm')) return Superscript;
  if (n.includes('index') || n.includes('indices')) return Superscript;
  if (n.includes('linear programming')) return SlidersHorizontal;
  if (n.includes('simultaneous eq')) return LayoutGrid;
  if (n.includes('quadratic')) return Crosshair;
  if (n.includes('change of subject')) return Shuffle;
  if (n.includes('algebraic') || n.includes('algebra')) return Sigma;
  if (n.includes('equation')) return Calculator;
  if (n.includes('inequalit')) return SlidersHorizontal;
  if (n.includes('variation')) return TrendingUp;
  if (n.includes('elevation') || n.includes('depression')) return Triangle;
  if (n.includes('trigonometr') || n.includes('pythagoras')) return Triangle;
  if (n.includes('bearing')) return Navigation;
  if (n.includes('circle theorem')) return Circle;
  if (n.includes('circle')) return Circle;
  if (n.includes('polygon')) return Hexagon;
  if (n.includes('construction')) return Compass;
  if (n.includes('symmetry')) return FlipHorizontal2;
  if (n.includes('lines and angles')) return Triangle;
  if (n.includes('locus')) return Crosshair;
  if (n.includes('similarity') || n.includes('congruenc')) return Copy;
  if (n.includes('data collect') || n.includes('data classif')) return Database;
  if (n.includes('data represent') || n.includes('cumulative')) return BarChart3;
  if (n.includes('central tendency')) return BarChart3;
  if (n.includes('dispersion')) return Activity;
  if (n.includes('matrix') || n.includes('matrices') || n.includes('determinant')) return LayoutGrid;
  if (n.includes('vector')) return ArrowUpRight;
  if (n.includes('probability')) return Dice5;
  if (n.includes('shear')) return ArrowDownRight;
  if (n.includes('stretch')) return MoveHorizontal;
  if (n.includes('enlargement')) return Maximize2;
  if (n.includes('rotation')) return RotateCw;
  if (n.includes('reflection')) return FlipVertical2;
  if (n.includes('translation')) return MoveRight;
  if (n.includes('ratio')) return Percent;
  return Calculator;
}
