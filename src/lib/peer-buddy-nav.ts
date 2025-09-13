
import { Award, BarChart2, MessagesSquare, MessageCircle } from "lucide-react";
import { NavItem } from "./types";

export const peerBuddyNavItems: NavItem[] = [
    { href: '/peer-buddy/dashboard', icon: BarChart2, label: 'Dashboard' },
    { href: '/peer-buddy/community', icon: MessagesSquare, label: 'Community' },
    { href: '/peer-buddy/requests', icon: MessageCircle, label: 'Student Chats' },
    { href: '/peer-buddy/certification', icon: Award, label: 'Certification' },
];
