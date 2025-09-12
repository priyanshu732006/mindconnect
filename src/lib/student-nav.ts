
import { Book, Bot, Home, Smile, Mic, Users, CalendarCheck } from "lucide-react";
import { NavItem } from "./types";

export const studentNavItems: NavItem[] = [
    { href: '/student/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/student/chat', icon: Bot, label: 'AI Companion' },
    { href: '/student/facial-analysis', icon: Smile, label: 'Facial Analysis' },
    { href: '/student/voice-analysis', icon: Mic, label: 'Voice Analysis' },
    { href: '/student/resources', icon: Book, label: 'Resources' },
    { href: '/student/booking', icon: CalendarCheck, label: 'Booking' },
    { href: '/student/support', icon: Users, label: 'Peer Support' },
];
