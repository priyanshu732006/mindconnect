
'use client';
import { Award, Coins, Flame } from "lucide-react";
import { useApp } from "@/context/app-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function GamificationStats() {
    const { coins, streak } = useApp();

    return (
        <TooltipProvider>
            <div className="flex items-center gap-4 rounded-full border bg-card px-4 py-2 shadow-sm">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Coins className="h-5 w-5 text-yellow-500" />
                            <span className="font-bold text-foreground">{coins}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{coins} Coins = ₹{(coins * 0.5).toFixed(2)} discount</p>
                    </TooltipContent>
                </Tooltip>

                <div className="h-6 w-px bg-border" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Flame className="h-5 w-5 text-orange-500" />
                            <span className="font-bold text-foreground">{streak}</span>
                        </div>
                     </TooltipTrigger>
                    <TooltipContent>
                        <p>{streak}-day streak. Keep it up!</p>
                    </TooltipContent>
                </Tooltip>
                
                <div className="h-6 w-px bg-border" />

                <Tooltip>
                    <TooltipTrigger asChild>
                         <div className="flex items-center gap-2 cursor-pointer">
                            <Award className="h-5 w-5 text-blue-500" />
                            <span className="font-bold text-foreground">3</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>3 Badges Unlocked</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}
