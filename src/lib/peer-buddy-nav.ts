
import { Award, BarChart2, MessagesSquare, UserPlus } from "lucide-react";
import { NavItem } from "./types";

export const peerBuddyNavItems: NavItem[] = [
    { href: '/peer-buddy/dashboard', icon: BarChart2, label: 'Dashboard' },
    { href: '/peer-buddy/requests', icon: UserPlus, label: 'Requests' },
    { href: '/peer-buddy/community', icon: MessagesSquare, label: 'Community Forum' },
    { href: '/peer-buddy/certification', icon: Award, label: 'Certification' },
];
