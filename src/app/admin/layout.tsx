
import AppLayout from "../(app)/layout";
import AuthGuard from "@/components/auth-guard";
import { UserRole } from "@/lib/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard role={UserRole.admin}><AppLayout>{children}</AppLayout></AuthGuard>;
}
