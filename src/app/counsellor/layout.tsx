
import AppLayout from "../(app)/layout";
import AuthGuard from "@/components/auth-guard";
import { UserRole } from "@/lib/types";

export default function CounsellorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard role={UserRole.counsellor}><AppLayout>{children}</AppLayout></AuthGuard>;
}
