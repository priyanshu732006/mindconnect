
import { WellbeingScore } from '@/components/dashboard/wellbeing-score';
import { CrisisAlert } from '@/components/dashboard/crisis-alert';
import { TrustedContacts } from '@/components/dashboard/trusted-contacts';
import { QuickLinks } from '@/components/dashboard/quick-links';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">
        Dashboard
      </h1>
      <CrisisAlert />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <WellbeingScore />
        </div>
        <div>
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
