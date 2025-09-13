
import {
  LayoutGrid,
  CalendarCheck,
  Clock,
  Check,
  FileText,
} from 'lucide-react';
import { NavItem } from './types';

export const externalCounsellorNavItems: NavItem[] = [
  {
    href: '/counsellor/external/dashboard',
    icon: LayoutGrid,
    label: 'Dashboard',
  },
  { href: '/counsellor/external/scheduled', icon: CalendarCheck, label: 'Scheduled' },
  { href: '/counsellor/external/waitlisted', icon: Clock, label: 'Waitlisted' },
  { href: '/counsellor/external/completed', icon: Check, label: 'Completed' },
  { href: '/counsellor/external/session-summary', icon: FileText, label: 'Session Summary' },
];
