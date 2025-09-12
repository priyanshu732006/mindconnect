
import { CalendarCheck, ShieldAlert, MessagesSquare, BarChart2 } from "lucide-react";
import { NavItem } from "./types";

export const counsellorNavItems: NavItem[] = [
    { href: '/counsellor/dashboard', icon: BarChart2, label: 'Dashboard' },
    { href: '/counsellor/appointments', icon: CalendarCheck, label: 'Appointments' },
    { href: '/counsellor/crisis-alerts', icon: ShieldAlert, label: 'Crisis Alerts' },
    { href: '/counsellor/community', icon: MessagesSquare, label: 'Community' },
];
