
import { WellbeingScore } from '@/components/dashboard/wellbeing-score';
import { CrisisAlert } from '@/components/dashboard/crisis-alert';
import { TrustedContacts } from '@/components/dashboard/trusted-contacts';
import { QuickLinks } from '@/components/dashboard/quick-links';
import { GamificationStats } from '@/components/dashboard/gamification-stats';
import { MoodJournal } from '@/components/dashboard/mood-journal';
import { Assessments } from '@/components/dashboard/assessments';
import { WeeklyChallenges } from '@/components/dashboard/weekly-challenges';
import { LifestyleTracker } from '@/components/dashboard/lifestyle-tracker';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Student Dashboard
        </h1>
        <GamificationStats />
      </div>

      <CrisisAlert />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          <MoodJournal />
          <WellbeingScore />
          <Assessments />
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-8">
          <WeeklyChallenges />
          <LifestyleTracker />
          <TrustedContacts />
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Explore
        </h2>
        <QuickLinks />
      </div>
    </div>
  );
}
