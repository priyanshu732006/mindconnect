
'use client';

import { useApp } from '@/context/app-provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getWellbeingCategory } from '@/lib/utils';
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';
import { Skeleton } from '../ui/skeleton';

export function WellbeingScore() {
  const { wellbeingData, messages, isAnalyzing } =
    useApp();

  if (messages.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center text-center p-8">
        <CardHeader>
          <CardTitle>Welcome to Your Dashboard</CardTitle>
          <CardDescription>
            Start a conversation with your AI Companion to get your first
            well-being analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <img
            src="https://picsum.photos/seed/zen/300/200"
            alt="Calm illustration"
            className="rounded-lg"
            data-ai-hint="calm relax"
          />
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/student/chat">Chat Now</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const score = wellbeingData?.wellbeingScore ?? 0;
  const categoryInfo = getWellbeingCategory(score);
  const chartData = [{ name: 'score', value: score }];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Well-being Score</CardTitle>
        <CardDescription>
          {wellbeingData
            ? 'Based on your recent conversation, updated in real-time.'
            : 'Start a conversation to see your score.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          {isAnalyzing && !wellbeingData ? (
             <div className="flex h-full flex-col items-center justify-center text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Analyzing your conversation...</p>
             </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="80%"
                outerRadius="100%"
                barSize={20}
                data={chartData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                  className="fill-primary"
                  style={{ fill: categoryInfo.rechartsColor }}
                />
                <g>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-5xl font-bold"
                  >
                    {isAnalyzing && <Loader2 className="inline-block h-12 w-12 animate-spin" />}
                    {!isAnalyzing && score}
                  </text>
                  <text
                    x="50%"
                    y="65%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`fill-current text-lg font-medium ${categoryInfo.colorClass}`}
                  >
                    {categoryInfo.name}
                  </text>
                </g>
              </RadialBarChart>
            </ResponsiveContainer>
          )}
        </div>
        {wellbeingData && (
          <div className="mt-4 text-center">
            <h4 className="font-semibold">Summary</h4>
             {isAnalyzing && !wellbeingData?.summary ? (
                <div className="space-y-2 mt-2">
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
             ) : (
                <p className="text-sm text-muted-foreground">
                {wellbeingData.summary}
                </p>
             )}
          </div>
        )}
      </CardContent>
       <CardFooter className="justify-center text-xs text-muted-foreground">
          <p>Your score updates automatically after each AI response.</p>
      </CardFooter>
    </Card>
  );
}
