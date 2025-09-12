
import AppLayout from "../(app)/layout";
import AuthGuard from "@/components/auth-guard";
import { UserRole } from "@/lib/types";

export default function PeerBuddyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard role={UserRole['peer-buddy']}><AppLayout>{children}</AppLayout></AuthGuard>;
}
