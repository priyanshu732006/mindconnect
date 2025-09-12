
import { BarChart2, ShieldAlert, Users } from "lucide-react";
import { NavItem } from "./types";

export const adminNavItems: NavItem[] = [
    { href: '/admin/dashboard', icon: BarChart2, label: 'Dashboard' },
    { href: '/admin/user-management', icon: Users, label: 'User Management' },
    { href: '/admin/crisis-monitoring', icon: ShieldAlert, label: 'Crisis Monitoring' },
    { href: '/admin/reports', icon: BarChart2, label: 'Reports' },
];
