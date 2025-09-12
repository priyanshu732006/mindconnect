
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Bed, Droplets, Monitor, Users } from "lucide-react";

export function LifestyleTracker() {
  const [sleep, setSleep] = useState([8]);
  const [screenTime, setScreenTime] = useState([5]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lifestyle Tracker</CardTitle>
        <CardDescription>Log your daily habits to see patterns.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="sleep-slider" className="flex items-center gap-2"><Bed /> Sleep Hours: <span className="font-bold">{sleep} hrs</span></Label>
          <Slider
            id="sleep-slider"
            min={0}
            max={12}
            step={0.5}
            value={sleep}
            onValueChange={setSleep}
          />
        </div>
        <div className="space-y-4">
           <Label htmlFor="screen-time-slider" className="flex items-center gap-2"><Monitor /> Screen Time: <span className="font-bold">{screenTime} hrs</span></Label>
          <Slider
            id="screen-time-slider"
            min={0}
            max={16}
            step={0.5}
            value={screenTime}
            onValueChange={setScreenTime}
          />
        </div>
        <div className="space-y-3">
             <div className="flex items-center space-x-2">
                <Checkbox id="hydration" />
                <Label htmlFor="hydration" className="font-normal flex items-center gap-2"><Droplets /> Stayed Hydrated</Label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="social" />
                <Label htmlFor="social" className="font-normal flex items-center gap-2"><Users /> Connected with someone</Label>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
