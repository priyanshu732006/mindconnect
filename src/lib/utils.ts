
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type WellbeingCategory = {
  name: 'Low Concern' | 'Moderate Concern' | 'High Concern' | 'Crisis' | 'Unknown';
  colorClass: string;
  backgroundColorClass: string;
  ringColorClass: string;
  rechartsColor: string;
};

export function getWellbeingCategory(score: number): WellbeingCategory {
  if (score === 0) {
    return {
        name: 'Unknown',
        colorClass: 'text-muted-foreground',
        backgroundColorClass: 'bg-muted',
        ringColorClass: 'ring-muted',
        rechartsColor: 'hsl(var(--muted))',
    };
  }
  if (score > 75) {
    return {
      name: 'Low Concern',
      colorClass: 'text-chart-1',
      backgroundColorClass: 'bg-chart-1/10',
      ringColorClass: 'ring-chart-1',
      rechartsColor: 'hsl(var(--chart-1))',
    };
  }
  if (score > 35) {
    return {
      name: 'Moderate Concern',
      colorClass: 'text-chart-2',
      backgroundColorClass: 'bg-chart-2/10',
      ringColorClass: 'ring-chart-2',
      rechartsColor: 'hsl(var(--chart-2))',
    };
  }
  if (score > 10) {
    return {
        name: 'High Concern',
        colorClass: 'text-chart-5',
        backgroundColorClass: 'bg-chart-5/10',
        ringColorClass: 'ring-chart-5',
        rechartsColor: 'hsl(var(--chart-5))',
    }
  }
  return {
    name: 'Crisis',
    colorClass: 'text-chart-4',
    backgroundColorClass: 'bg-chart-4/10',
    ringColorClass: 'ring-chart-4',
    rechartsColor: 'hsl(var(--chart-4))',
  };
}
