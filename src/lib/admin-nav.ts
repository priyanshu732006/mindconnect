
import { LayoutGrid, Users, BarChart2, AlertTriangle } from "lucide-react";
import { NavItem } from "./types";

export const adminNavItems: NavItem[] = [
    { href: '/admin/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { href: '/admin/user-management', icon: Users, label: 'Users' },
    { href: '/admin/crisis-monitoring', icon: AlertTriangle, label: 'Crisis Monitoring' },
    { href: '/admin/reports', icon: BarChart2, label: 'Reports' },
];
