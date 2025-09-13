import { Calendar, LayoutGrid, Users, AlertTriangle, Settings } from "lucide-react";
import { NavItem } from "./types";

export const counsellorNavItems: NavItem[] = [
    { href: '/counsellor/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { href: '/counsellor/appointments', icon: Calendar, label: 'Appointments' },
    { href: '/counsellor/community', icon: Users, label: 'Community' },
    { href: '/counsellor/crisis-alerts', icon: AlertTriangle, label: 'Crisis Alerts' },
    { href: '/counsellor/settings', icon: Settings, label: 'Settings'},
];
