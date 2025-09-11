import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type WellbeingCategory = {
  name: 'Stable' | 'Mild Concern' | 'Moderate Concern' | 'Crisis';
  colorClass: string;
  backgroundColorClass: string;
  ringColorClass: string;
  rechartsColor: string;
};

export function getWellbeingCategory(score: number): WellbeingCategory {
  if (score > 75) {
    return {
      name: 'Stable',
      colorClass: 'text-chart-1',
      backgroundColorClass: 'bg-chart-1/10',
      ringColorClass: 'ring-chart-1',
      rechartsColor: 'hsl(var(--chart-1))',
    };
  }
  if (score > 50) {
    return {
      name: 'Mild Concern',
      colorClass: 'text-chart-2',
      backgroundColorClass: 'bg-chart-2/10',
      ringColorClass: 'ring-chart-2',
      rechartsColor: 'hsl(var(--chart-2))',
    };
  }
  if (score > 25) {
    return {
      name: 'Moderate Concern',
      colorClass: 'text-chart-3',
      backgroundColorClass: 'bg-chart-3/10',
      ringColorClass: 'ring-chart-3',
      rechartsColor: 'hsl(var(--chart-3))',
    };
  }
  return {
    name: 'Crisis',
    colorClass: 'text-chart-4',
    backgroundColorClass: 'bg-chart-4/10',
    ringColorClass: 'ring-chart-4',
    rechartsColor: 'hsl(var(--chart-4))',
  };
}
