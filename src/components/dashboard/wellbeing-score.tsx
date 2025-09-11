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

export function WellbeingScore() {
  const { wellbeingData, messages, analyzeConversation, isAnalyzing } =
    useApp();

  const handleAnalysis = () => {
    analyzeConversation();
  };

  if (!wellbeingData && messages.length === 0) {
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
            <Link href="/chat">Chat Now</Link>
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
            ? 'Based on your recent conversation.'
            : 'Analyze your conversation to see your score.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          {wellbeingData ? (
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
                    {score}
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
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-muted-foreground mb-4">
                You have an unanalyzed conversation.
              </p>
              <Button
                onClick={handleAnalysis}
                disabled={isAnalyzing || messages.length === 0}
              >
                {isAnalyzing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Analyze Conversation
              </Button>
            </div>
          )}
        </div>
        {wellbeingData && (
          <div className="mt-4 text-center">
            <h4 className="font-semibold">Summary</h4>
            <p className="text-sm text-muted-foreground">
              {wellbeingData.summary}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <Button
          onClick={handleAnalysis}
          disabled={isAnalyzing || messages.length === 0}
          variant="outline"
        >
          {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Re-analyze Conversation
        </Button>
      </CardFooter>
    </Card>
  );
}
